import { CONFIG } from './config';
import { getTodayKey } from './utils';


export interface Env {
  OVH_AI_TOKEN: string;
  RATE_LIMIT_KV?: KVNamespace;
  USAGE_KV?: KVNamespace;
}


interface RateLimitData {
  count: number;
  resetTime: number;
}


export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}


export async function checkRateLimit(
  clientIP: string,
  env: Env
): Promise<RateLimitResult> {
  if (!env.RATE_LIMIT_KV) {
    console.warn('RATE_LIMIT_KV not configured, skipping rate limit');
    return { allowed: true };
  }

  const key = `rate:${clientIP}`;
  const now = Date.now();

  try {
   
    const data = await env.RATE_LIMIT_KV.get<RateLimitData>(key, 'json');

    if (!data || now > data.resetTime) {
      await env.RATE_LIMIT_KV.put(
        key,
        JSON.stringify({
          count: 1,
          resetTime: now + CONFIG.rateLimit.windowMs,
        }),
        { expirationTtl: Math.ceil(CONFIG.rateLimit.windowMs / 1000) }
      );
      return { allowed: true };
    }

    if (data.count < CONFIG.rateLimit.maxRequests) {
      await env.RATE_LIMIT_KV.put(
        key,
        JSON.stringify({
          count: data.count + 1,
          resetTime: data.resetTime,
        }),
        { expirationTtl: Math.ceil(CONFIG.rateLimit.windowMs / 1000) }
      );
      return { allowed: true };
    }

    const retryAfter = Math.ceil((data.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true };
  }
}


export async function checkDailyBudget(
  estimatedTokens: number,
  env: Env
): Promise<{ allowed: boolean; current: number; limit: number }> {

  if (!env.USAGE_KV) {
    console.warn('USAGE_KV not configured, skipping budget check');
    return { allowed: true, current: 0, limit: CONFIG.budget.dailyTokenLimit };
  }

  const key = `usage:${getTodayKey()}`;

  try {
    const currentUsage = await env.USAGE_KV.get(key);
    const current = currentUsage ? parseInt(currentUsage) : 0;
    const newTotal = current + estimatedTokens;

    if (newTotal > CONFIG.budget.dailyTokenLimit) {
      return {
        allowed: false,
        current,
        limit: CONFIG.budget.dailyTokenLimit,
      };
    }

    return { allowed: true, current, limit: CONFIG.budget.dailyTokenLimit };
  } catch (error) {
    console.error('Budget check failed:', error);
   
    return { allowed: true, current: 0, limit: CONFIG.budget.dailyTokenLimit };
  }
}

export async function recordUsage(tokens: number, env: Env): Promise<void> {
  if (!env.USAGE_KV) return;

  const key = `usage:${getTodayKey()}`;

  try {
    const currentUsage = await env.USAGE_KV.get(key);
    const current = currentUsage ? parseInt(currentUsage) : 0;
    const newTotal = current + tokens;

    await env.USAGE_KV.put(key, String(newTotal), {
      expirationTtl: 86400 * 7, 
    });

   
    const percentage = (newTotal / CONFIG.budget.dailyTokenLimit) * 100;
    if (percentage >= CONFIG.budget.alertThreshold * 100) {
      console.warn(
        ` Daily budget at ${percentage.toFixed(1)}% (${newTotal}/${CONFIG.budget.dailyTokenLimit} tokens)`
      );
    }
  } catch (error) {
    console.error('Failed to record usage:', error);
  }
}