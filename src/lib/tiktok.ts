const SUPPORTED_TIKTOK_HOSTS = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
]);

function isSupportedTikTokHost(hostname: string) {
  const normalized = hostname.trim().toLowerCase();
  return SUPPORTED_TIKTOK_HOSTS.has(normalized) || normalized.endsWith(".tiktok.com");
}

export function normalizeTikTokUrl(value: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error("TikTok URL is required.");
  }

  let url: URL;

  try {
    url = new URL(normalized);
  } catch {
    throw new Error("TikTok URL must be a valid URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("TikTok URL must use HTTP or HTTPS.");
  }

  if (!isSupportedTikTokHost(url.hostname)) {
    throw new Error("TikTok URL must point to TikTok.");
  }

  return url.toString();
}

export function parseOptionalTikTokUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    return normalizeTikTokUrl(value);
  } catch {
    return null;
  }
}

export function extractTikTokVideoId(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/video\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function buildTikTokEmbedUrl(value: string | null | undefined): string | null {
  const videoId = extractTikTokVideoId(value);
  return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
}
