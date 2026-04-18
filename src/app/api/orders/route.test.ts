import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import {
  GET,
  POST,
  resetConsumeRateLimitHandlerForTesting,
  resetListAdminOrdersHandlerForTesting,
  resetSubmitQuickOrderHandlerForTesting,
  setConsumeRateLimitHandlerForTesting,
  setListAdminOrdersHandlerForTesting,
  setSubmitQuickOrderHandlerForTesting,
} from "@/app/api/orders/route";
import { OrderAdminError, OrderSubmissionError } from "@/services/orders";
import type { OrderAdminListItem } from "@/types";

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
    notification: {
      status: "sent",
      code: "NOTIFICATION_SENT",
      message: "sent",
    },
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

test("POST /api/orders returns degraded success payload when notification fails", async () => {
  setSubmitQuickOrderHandlerForTesting(async () => ({
    ok: true,
    orderId: "ORD-20260418-XYZXYZ",
    status: "new",
    duplicate: false,
    normalizedPhone: "0912345678",
    itemCount: 1,
    createdAt: "2026-04-18T09:20:00.000Z",
    message: "Yeu cau da duoc ghi nhan.",
    notification: {
      status: "failed",
      code: "NOTIFICATION_DELIVERY_FAILED",
      message: "failed",
    },
    warning: "Order recorded but notification failed.",
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
  const payload = (await response.json()) as { warning?: string; notification: { status: string } };

  assert.equal(response.status, 201);
  assert.equal(payload.notification.status, "failed");
  assert.match(payload.warning ?? "", /notification/i);

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

test("POST /api/orders returns 429 when rate limited", async () => {
  setConsumeRateLimitHandlerForTesting(() => ({
    allowed: false,
    remaining: 0,
    resetAt: 123456789,
  }));

  const request = new NextRequest("http://localhost:3000/api/orders", {
    method: "POST",
    body: JSON.stringify({
      phone: "0912345678",
      selectedProductIds: ["SERUM-01"],
    }),
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "127.0.0.1",
    },
  });

  const response = await POST(request);
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 429);
  assert.equal(payload.code, "ORDER_RATE_LIMITED");
  assert.equal(response.headers.get("x-ratelimit-reset"), "123456789");

  resetConsumeRateLimitHandlerForTesting();
});

test("GET /api/orders returns normalized admin list response", async () => {
  const items: OrderAdminListItem[] = [
    {
      orderId: "ORD-20260418-AAAAAA",
      createdAt: "2026-04-18T10:00:00.000Z",
      phone: "0912345678",
      customerName: "Lan",
      selectedProductIds: ["SERUM-01"],
      selectedProductNames: ["Serum"],
      itemCount: 1,
      customerNote: "",
      status: "new",
      adminNote: "",
      sourcePage: "listing",
      sourceCampaign: "",
      duplicateFlag: false,
      clientFingerprint: "",
      processedAt: null,
    },
  ];

  setListAdminOrdersHandlerForTesting(async () => items);

  const response = await GET(new NextRequest("http://localhost:3000/api/orders?q=0912"));
  const payload = (await response.json()) as { items: OrderAdminListItem[]; total: number };

  assert.equal(response.status, 200);
  assert.equal(payload.total, 1);
  assert.equal(payload.items[0]?.orderId, items[0]?.orderId);

  resetListAdminOrdersHandlerForTesting();
});

test("GET /api/orders returns mapped filter errors", async () => {
  setListAdminOrdersHandlerForTesting(async () => {
    throw new OrderAdminError("Trang thai khong hop le.", {
      statusCode: 400,
      code: "INVALID_ORDER_STATUS_FILTER",
    });
  });

  const response = await GET(new NextRequest("http://localhost:3000/api/orders?status=new"));
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_ORDER_STATUS_FILTER");

  resetListAdminOrdersHandlerForTesting();
});
