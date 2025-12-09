import { CONFIG } from './config';
import { checkRateLimit, Env } from './rate-limit';
import { validateRequest, sanitizeModelParams, ChatRequest } from './validation';
import { getCorsHeaders, jsonResponse, errorResponse, getClientIP } from './utils';

interface OVHResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(),
      });
    }

    if (request.method !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    try {
      const clientIP = getClientIP(request);
      const rateLimitResult = await checkRateLimit(clientIP, env);

      if (!rateLimitResult.allowed) {
        return errorResponse(
          'Too many requests',
          429,
          {
            retryAfter: rateLimitResult.retryAfter,
            message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
          }
        );
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse('Invalid JSON body');
      }

      const validation = validateRequest(body);
      if (!validation.valid) {
        return errorResponse(validation.error || 'Invalid request');
      }

      const safeParams = sanitizeModelParams(body as ChatRequest);
      const { frequency_penalty, presence_penalty, ...paramsToSend } = safeParams;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout.requestTimeout);

      try {
        const endpointURL = env.OVH_EP_URL;
        const modelName = env.OVH_MODEL_NAME || 'gpt-oss-120b';

        const ovhResponse = await fetch(endpointURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.OVH_API_TOKEN}`,
          },
          body: JSON.stringify({
            model: modelName,
            ...paramsToSend,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!ovhResponse.ok) {
          const errorText = await ovhResponse.text();
          console.error('OVH API error:', {
            status: ovhResponse.status,
            statusText: ovhResponse.statusText,
            body: errorText
          });
          
          return errorResponse(
            'AI service error',
            ovhResponse.status,
            { details: errorText }
          );
        }

        const data = await ovhResponse.json() as OVHResponse;
        return jsonResponse(data);
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        
        if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
          return errorResponse('Request timeout', 504);
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return errorResponse(
        'Internal server error',
        500,
        { message: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  },
};