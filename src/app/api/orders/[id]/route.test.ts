import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import { PATCH } from "@/app/api/orders/[id]/route";
import {
  resetUpdateAdminOrderHandlerForTesting,
  setUpdateAdminOrderHandlerForTesting,
} from "@/app/api/orders/[id]/handlers";
import { OrderAdminError } from "@/services/orders";
import type { OrderAdminListItem } from "@/types";

const orderFixture: OrderAdminListItem = {
  orderId: "ORD-20260418-ABCDEF",
  createdAt: "2026-04-18T09:20:00.000Z",
  phone: "0912345678",
  customerName: "Lan",
  selectedProductIds: ["SERUM-01"],
  selectedProductNames: ["Serum Phuc Hoi"],
  itemCount: 1,
  customerNote: "",
  status: "pass",
  adminNote: "Da goi",
  sourcePage: "listing",
  sourceCampaign: "",
  duplicateFlag: false,
  clientFingerprint: "",
  processedAt: "2026-04-18T10:00:00.000Z",
};

test("PATCH /api/orders/[id] returns 400 for invalid JSON", async () => {
  const request = new NextRequest("http://localhost:3000/api/orders/ORD-1", {
    method: "PATCH",
    body: "{invalid",
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await PATCH(request, {
    params: Promise.resolve({ id: "ORD-1" }),
  });
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_JSON");
});

test("PATCH /api/orders/[id] returns updated order payload", async () => {
  setUpdateAdminOrderHandlerForTesting(async () => orderFixture);

  const request = new NextRequest("http://localhost:3000/api/orders/ORD-1", {
    method: "PATCH",
    body: JSON.stringify({
      status: "pass",
      adminNote: "Da goi",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await PATCH(request, {
    params: Promise.resolve({ id: "ORD-1" }),
  });
  const payload = (await response.json()) as { order: OrderAdminListItem };

  assert.equal(response.status, 200);
  assert.equal(payload.order.orderId, orderFixture.orderId);
  assert.equal(payload.order.status, "pass");

  resetUpdateAdminOrderHandlerForTesting();
});

test("PATCH /api/orders/[id] maps admin update errors", async () => {
  setUpdateAdminOrderHandlerForTesting(async () => {
    throw new OrderAdminError("Khong tim thay don hang.", {
      statusCode: 404,
      code: "ORDER_NOT_FOUND",
    });
  });

  const request = new NextRequest("http://localhost:3000/api/orders/ORD-404", {
    method: "PATCH",
    body: JSON.stringify({
      status: "pass",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await PATCH(request, {
    params: Promise.resolve({ id: "ORD-404" }),
  });
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 404);
  assert.equal(payload.code, "ORDER_NOT_FOUND");

  resetUpdateAdminOrderHandlerForTesting();
});
