import { getConfig } from './config';

export interface Env {
  OVH_MODEL_NAME: string;
  OVH_API_TOKEN: string;
  OVH_EP_URL: string;
  TURNSTILE_SECRET: string;
  rate_limiter?: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
}

export interface RateLimitResult {
  allowed: boolean;
}

interface IpEntry {
  tokens: number;
  windowStart: number;
}

interface DailyBudget {
  day: string;
  tokensUsed: number;
}

const ipStore = new Map<string, IpEntry>();

const dailyBudget: DailyBudget = {
  day: new Date().toISOString().split('T')[0],
  tokensUsed: 0,
};

export function checkDailyBudget(
  config: ReturnType<typeof getConfig>
): RateLimitResult {
  const today = new Date().toISOString().split('T')[0];

  if (dailyBudget.day !== today) {
    dailyBudget.day = today;
    dailyBudget.tokensUsed = 0;
  }

  return { allowed: dailyBudget.tokensUsed < config.budget.dailyTokenLimit };
}

export function recordTokenUsage(tokens: number): void {
  dailyBudget.tokensUsed += tokens;
}

export function checkRateLimit(
  clientIP: string,
  config: ReturnType<typeof getConfig>
): RateLimitResult {
  const now = Date.now();
  const { maxRequests, windowMs } = config.rateLimit;

  const entry = ipStore.get(clientIP);

  if (!entry || now - entry.windowStart >= windowMs) {
    ipStore.set(clientIP, { tokens: maxRequests - 1, windowStart: now });
    return { allowed: true };
  }
  if (entry.tokens <= 0) {
    return { allowed: false };
  }

  entry.tokens--;
  return { allowed: true };
}