import assert from "node:assert/strict";
import test from "node:test";

import { trackEvent } from "@/lib/analytics";

test("trackEvent does not throw when window is unavailable", () => {
  assert.doesNotThrow(() => {
    trackEvent("catalog_viewed", {
      source: "test",
    });
  });
});
