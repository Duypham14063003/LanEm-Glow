import test from "node:test";
import assert from "node:assert/strict";

import ProductsPage from "@/app/(site)/products/page";

test("products listing resolves with an empty-state-friendly page when catalog data is unavailable", async () => {
  const originalEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const originalKey = process.env.GOOGLE_PRIVATE_KEY;
  const originalSheetId = process.env.GOOGLE_SHEET_ID;

  delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.GOOGLE_PRIVATE_KEY;
  delete process.env.GOOGLE_SHEET_ID;

  const page = await ProductsPage({
    searchParams: Promise.resolve({}),
  });

  assert.ok(page);

  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = originalEmail;
  process.env.GOOGLE_PRIVATE_KEY = originalKey;
  process.env.GOOGLE_SHEET_ID = originalSheetId;
});
