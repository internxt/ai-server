import { CONFIG } from './config';


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


export function validateRequest(body: unknown): ValidationResult {
  
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

  if (request.messages.length > CONFIG.validation.maxMessages) {
    return {
      valid: false,
      error: `Too many messages (max ${CONFIG.validation.maxMessages})`,
    };
  }

 
  for (let i = 0; i < request.messages.length; i++) {
    const result = validateMessage(request.messages[i], i);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}


function validateMessage(msg: unknown, index: number): ValidationResult {
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

  if (!CONFIG.validation.allowedRoles.includes(message.role)) {
    return {
      valid: false,
      error: `Invalid role at index ${index}: ${message.role}. Allowed: ${CONFIG.validation.allowedRoles.join(', ')}`,
    };
  }

 
  if (typeof message.content !== 'string') {
    return { valid: false, error: `Content at index ${index} must be a string` };
  }

  if (message.content.length > CONFIG.validation.maxMessageLength) {
    return {
      valid: false,
      error: `Message at index ${index} is too long (max ${CONFIG.validation.maxMessageLength} chars)`,
    };
  }

  return { valid: true };
}


export function sanitizeModelParams(request: ChatRequest) {
  return {
    messages: request.messages,
    max_tokens: Math.min(
      request.max_tokens || CONFIG.model.maxTokens,
      CONFIG.model.maxTokens
    ),
    temperature: Math.min(
      Math.max(
        request.temperature ?? CONFIG.model.defaultTemperature,
        CONFIG.model.minTemperature
      ),
      CONFIG.model.maxTemperature
    ),
    frequency_penalty: CONFIG.model.frequencyPenalty,
    presence_penalty: CONFIG.model.presencePenalty,
  };
}