import { CONFIG } from './config';


export function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': CONFIG.cors.allowOrigin,
    'Access-Control-Allow-Methods': CONFIG.cors.allowMethods.join(', '),
    'Access-Control-Allow-Headers': CONFIG.cors.allowHeaders.join(', '),
    'Content-Type': 'application/json',
  };
}


export function jsonResponse(
  data: unknown,
  status = 200,
  additionalHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCorsHeaders(),
      ...additionalHeaders,
    },
  });
}


export function errorResponse(
  message: string,
  status = 400,
  additionalData: Record<string, unknown> = {}
): Response {
  return jsonResponse(
    {
      error: message,
      ...additionalData,
    },
    status
  );
}

export function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}


export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}