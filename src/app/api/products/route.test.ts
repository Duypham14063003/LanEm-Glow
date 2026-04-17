import test from "node:test";
import assert from "node:assert/strict";

import { NextRequest } from "next/server";

import { GET } from "@/app/api/products/route";

test("GET /api/products returns 500 when Sheets configuration is missing", async () => {
  const originalEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const originalKey = process.env.GOOGLE_PRIVATE_KEY;
  const originalSheetId = process.env.GOOGLE_SHEET_ID;

  delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.GOOGLE_PRIVATE_KEY;
  delete process.env.GOOGLE_SHEET_ID;

  const response = await GET(new NextRequest("http://localhost:3000/api/products"));
  const payload = (await response.json()) as { error: string };

  assert.equal(response.status, 500);
  assert.match(payload.error, /Missing required environment variable/);

  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = originalEmail;
  process.env.GOOGLE_PRIVATE_KEY = originalKey;
  process.env.GOOGLE_SHEET_ID = originalSheetId;
});
