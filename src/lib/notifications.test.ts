import assert from "node:assert/strict";
import test from "node:test";

import { notifyAdminOfNewOrder } from "@/lib/notifications";
import type { OrderAdminListItem } from "@/types";

const orderFixture: OrderAdminListItem = {
  orderId: "ORD-20260418-AAAAAA",
  createdAt: "2026-04-18T10:00:00.000Z",
  phone: "0912345678",
  customerName: "Lan",
  selectedProductIds: ["SERUM-01"],
  selectedProductNames: ["Serum Phuc Hoi"],
  itemCount: 1,
  customerNote: "Da nhay cam",
  status: "new",
  adminNote: "",
  sourcePage: "listing",
  sourceCampaign: "",
  duplicateFlag: false,
  clientFingerprint: "",
  processedAt: null,
};

test("notifyAdminOfNewOrder skips when notifications are disabled", async () => {
  const originalEnabled = process.env.ADMIN_NOTIFY_ENABLED;
  process.env.ADMIN_NOTIFY_ENABLED = "false";

  const result = await notifyAdminOfNewOrder(orderFixture);

  assert.equal(result.status, "skipped");
  assert.equal(result.code, "NOTIFICATION_DISABLED");

  process.env.ADMIN_NOTIFY_ENABLED = originalEnabled;
});

test("notifyAdminOfNewOrder reports failed delivery from mail transport", async () => {
  const originalEnabled = process.env.ADMIN_NOTIFY_ENABLED;
  const originalEmail = process.env.ADMIN_NOTIFY_EMAIL;
  const originalHost = process.env.SMTP_HOST;
  const originalPort = process.env.SMTP_PORT;
  const originalUser = process.env.SMTP_USER;
  const originalPass = process.env.SMTP_PASS;

  process.env.ADMIN_NOTIFY_ENABLED = "true";
  process.env.ADMIN_NOTIFY_EMAIL = "admin@example.com";
  process.env.SMTP_HOST = "smtp.example.com";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "user";
  process.env.SMTP_PASS = "pass";

  const result = await notifyAdminOfNewOrder(orderFixture, {
    sendMail: async () => {
      throw new Error("smtp failed");
    },
  });

  assert.equal(result.status, "failed");
  assert.equal(result.code, "NOTIFICATION_DELIVERY_FAILED");

  process.env.ADMIN_NOTIFY_ENABLED = originalEnabled;
  process.env.ADMIN_NOTIFY_EMAIL = originalEmail;
  process.env.SMTP_HOST = originalHost;
  process.env.SMTP_PORT = originalPort;
  process.env.SMTP_USER = originalUser;
  process.env.SMTP_PASS = originalPass;
});
