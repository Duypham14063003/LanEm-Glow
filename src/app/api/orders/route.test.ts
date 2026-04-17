import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import {
  POST,
  resetSubmitQuickOrderHandlerForTesting,
  setSubmitQuickOrderHandlerForTesting,
} from "@/app/api/orders/route";
import { OrderSubmissionError } from "@/services/orders";

test("POST /api/orders returns 400 for invalid JSON", async () => {
  const request = new NextRequest("http://localhost:3000/api/orders", {
    method: "POST",
    body: "{invalid",
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await POST(request);
  const payload = (await response.json()) as { error: string; code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_JSON");
});

test("POST /api/orders returns 201 for successful order creation", async () => {
  setSubmitQuickOrderHandlerForTesting(async () => ({
    ok: true,
    orderId: "ORD-20260418-ABCDEF",
    status: "new",
    duplicate: false,
    normalizedPhone: "0912345678",
    itemCount: 2,
    createdAt: "2026-04-18T09:20:00.000Z",
    message: "Yeu cau da duoc ghi nhan.",
  }));

  const request = new NextRequest("http://localhost:3000/api/orders", {
    method: "POST",
    body: JSON.stringify({
      phone: "0912345678",
      selectedProductIds: ["SERUM-01"],
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await POST(request);
  const payload = (await response.json()) as { orderId: string; status: string };

  assert.equal(response.status, 201);
  assert.equal(payload.orderId, "ORD-20260418-ABCDEF");
  assert.equal(payload.status, "new");

  resetSubmitQuickOrderHandlerForTesting();
});

test("POST /api/orders returns mapped validation errors", async () => {
  setSubmitQuickOrderHandlerForTesting(async () => {
    throw new OrderSubmissionError("So dien thoai khong hop le.", {
      statusCode: 400,
      code: "INVALID_ORDER_PAYLOAD",
    });
  });

  const request = new NextRequest("http://localhost:3000/api/orders", {
    method: "POST",
    body: JSON.stringify({
      phone: "123",
      selectedProductIds: ["SERUM-01"],
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await POST(request);
  const payload = (await response.json()) as { error: string; code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_ORDER_PAYLOAD");
  assert.match(payload.error, /khong hop le/i);

  resetSubmitQuickOrderHandlerForTesting();
});
