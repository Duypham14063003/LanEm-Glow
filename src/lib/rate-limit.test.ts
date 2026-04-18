import assert from "node:assert/strict";
import test from "node:test";

import { consumeRateLimit, getRateLimitKey, resetRateLimitStore } from "@/lib/rate-limit";

test("getRateLimitKey prefers forwarded IP headers", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.10, 10.0.0.1",
  });

  assert.equal(getRateLimitKey(headers), "203.0.113.10");
});

test("consumeRateLimit blocks requests after the configured limit", () => {
  resetRateLimitStore();

  const first = consumeRateLimit("test-key", {
    limit: 2,
    windowMs: 60000,
    now: () => 1000,
  });
  const second = consumeRateLimit("test-key", {
    limit: 2,
    windowMs: 60000,
    now: () => 1001,
  });
  const third = consumeRateLimit("test-key", {
    limit: 2,
    windowMs: 60000,
    now: () => 1002,
  });

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);
});
