type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function getRateLimitKey(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = requestHeaders.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "anonymous";
}

export function consumeRateLimit(
  key: string,
  options?: { limit?: number; windowMs?: number; now?: () => number }
): RateLimitResult {
  const limit = options?.limit ?? Number(process.env.ORDER_RATE_LIMIT_MAX ?? "5");
  const windowMs =
    options?.windowMs ?? Number(process.env.ORDER_RATE_LIMIT_WINDOW_MS ?? "60000");
  const now = options?.now?.() ?? Date.now();

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      resetAt: now + windowMs,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(limit - current.count, 0),
    resetAt: current.resetAt,
  };
}

export function resetRateLimitStore() {
  buckets.clear();
}
