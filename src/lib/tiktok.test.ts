import assert from "node:assert/strict";
import test from "node:test";

import {
  buildTikTokEmbedUrl,
  extractTikTokVideoId,
  normalizeTikTokUrl,
  parseOptionalTikTokUrl,
} from "@/lib/tiktok";

test("normalizeTikTokUrl accepts supported TikTok video URLs", () => {
  const normalized = normalizeTikTokUrl(
    "https://www.tiktok.com/@lanemglow/video/7481234567890123456"
  );

  assert.equal(normalized, "https://www.tiktok.com/@lanemglow/video/7481234567890123456");
});

test("parseOptionalTikTokUrl returns null for invalid TikTok values", () => {
  assert.equal(parseOptionalTikTokUrl("notaurl"), null);
  assert.equal(parseOptionalTikTokUrl("https://example.com/video/123"), null);
});

test("extractTikTokVideoId and buildTikTokEmbedUrl derive embeddable media values", () => {
  const url = "https://www.tiktok.com/@lanemglow/video/7481234567890123456";

  assert.equal(extractTikTokVideoId(url), "7481234567890123456");
  assert.equal(
    buildTikTokEmbedUrl(url),
    "https://www.tiktok.com/embed/v2/7481234567890123456"
  );
});
