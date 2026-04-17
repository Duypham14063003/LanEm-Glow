type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export function getCatalogCacheTtlMs(): number {
  const ttlSeconds = Number(process.env.CATALOG_CACHE_TTL_SECONDS ?? "300");

  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
    return 300_000;
  }

  return ttlSeconds * 1000;
}

export async function withCache<T>(
  key: string,
  loader: () => Promise<T>,
  options?: { ttlMs?: number; skipCache?: boolean }
): Promise<T> {
  const ttlMs = options?.ttlMs ?? getCatalogCacheTtlMs();

  if (!options?.skipCache) {
    const cached = memoryCache.get(key) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
  }

  const value = await loader();
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });

  return value;
}

export function invalidateCache(key: string) {
  memoryCache.delete(key);
}
