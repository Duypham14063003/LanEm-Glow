import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "@/app/api/admin/orders/route";
import {
  resetCreateAdminOrderHandlerForTesting,
  setCreateAdminOrderHandlerForTesting,
} from "@/app/api/admin/orders/handlers";
import { OrderSubmissionError } from "@/services/orders";
import type { OrderAdminListItem } from "@/types";

const order: OrderAdminListItem = {
  orderId: "ORD-20260418-NEWONE",
  createdAt: "2026-04-18T10:30:00.000Z",
  phone: "0912345678",
  customerName: "Lan",
  selectedProductIds: ["SERUM-01"],
  selectedProductNames: ["Serum"],
  itemCount: 1,
  customerNote: "",
  status: "new",
  adminNote: "",
  sourcePage: "admin_manual",
  sourceCampaign: "hotline",
  duplicateFlag: false,
  clientFingerprint: "",
  processedAt: null,
};

test("POST /api/admin/orders returns 400 for invalid JSON", async () => {
  const response = await POST(
    new Request("http://localhost:3000/api/admin/orders", {
      method: "POST",
      body: "{bad",
      headers: { "content-type": "application/json" },
    })
  );
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_JSON");
});

test("POST /api/admin/orders returns created order payload", async () => {
  setCreateAdminOrderHandlerForTesting(async () => order);

  const response = await POST(
    new Request("http://localhost:3000/api/admin/orders", {
      method: "POST",
      body: JSON.stringify({ phone: "0912345678", selectedProductIds: ["SERUM-01"] }),
      headers: { "content-type": "application/json" },
    })
  );
  const payload = (await response.json()) as { order: OrderAdminListItem };

  assert.equal(response.status, 201);
  assert.equal(payload.order.orderId, order.orderId);

  resetCreateAdminOrderHandlerForTesting();
});

test("POST /api/admin/orders maps validation errors", async () => {
  setCreateAdminOrderHandlerForTesting(async () => {
    throw new OrderSubmissionError("Payload khong hop le.", {
      statusCode: 400,
      code: "INVALID_ORDER_PAYLOAD",
    });
  });

  const response = await POST(
    new Request("http://localhost:3000/api/admin/orders", {
      method: "POST",
      body: JSON.stringify({ phone: "123" }),
      headers: { "content-type": "application/json" },
    })
  );
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_ORDER_PAYLOAD");

  resetCreateAdminOrderHandlerForTesting();
});
