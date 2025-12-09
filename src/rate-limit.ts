export interface Env {
  OVH_AI_TOKEN: string;
  rate_limiter: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

export async function checkRateLimit(
  clientIP: string,
  env: Env
): Promise<RateLimitResult> {
  if (!env.rate_limiter) {
    return { allowed: true };
  }

  try {
    const { success } = await env.rate_limiter.limit({ key: clientIP });

    if (!success) {
      return { allowed: false, retryAfter: 60 };
    }

    return { allowed: true };
  } catch (error) {
    return { allowed: true };
  }
}