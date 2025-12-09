
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateRequest(body: unknown, config: any): ValidationResult {
  
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const request = body as ChatRequest;

  if (!request.messages || !Array.isArray(request.messages)) {
    return { valid: false, error: 'messages must be an array' };
  }
  
  if (request.messages.length === 0) {
    return { valid: false, error: 'messages array cannot be empty' };
  }

  if (request.messages.length > config.validation.maxMessages) {
    return {
      valid: false,
      error: `Too many messages (max ${config.validation.maxMessages})`,
    };
  }

  for (let i = 0; i < request.messages.length; i++) {
    const result = validateMessage(request.messages[i], i, config);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

function validateMessage(msg: unknown, index: number, config: any): ValidationResult {
  if (!msg || typeof msg !== 'object') {
    return { valid: false, error: `Message at index ${index} must be an object` };
  }

  const message = msg as Message;
  
  if (!message.role || !message.content) {
    return {
      valid: false,
      error: `Message at index ${index} must have 'role' and 'content'`,
    };
  }

  if (!config.validation.allowedRoles.includes(message.role)) {
    return {
      valid: false,
      error: `Invalid role at index ${index}: ${message.role}. Allowed: ${config.validation.allowedRoles.join(', ')}`,
    };
  }

  if (typeof message.content !== 'string') {
    return { valid: false, error: `Content at index ${index} must be a string` };
  }

  if (message.content.length > config.validation.maxMessageLength) {
    return {
      valid: false,
      error: `Message at index ${index} is too long (max ${config.validation.maxMessageLength} chars)`,
    };
  }

  return { valid: true };
}

export function sanitizeModelParams(request: ChatRequest, config: any) {
  return {
    messages: request.messages,
    max_tokens: Math.min(
      request.max_tokens || config.model.maxTokens,
      config.model.maxTokens
    ),
    temperature: Math.min(
      Math.max(
        request.temperature ?? config.model.defaultTemperature,
        config.model.minTemperature
      ),
      config.model.maxTemperature
    ),
    frequency_penalty: config.model.frequencyPenalty,
    presence_penalty: config.model.presencePenalty,
  };
}