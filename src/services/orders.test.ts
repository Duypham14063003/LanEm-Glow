import assert from "node:assert/strict";
import test from "node:test";

import {
  createAdminOrder,
  listAdminOrders,
  isDuplicateOrderCandidate,
  normalizeOrderListItem,
  normalizeOrderPayload,
  OrderSubmissionError,
  OrderAdminError,
  updateAdminOrder,
  submitQuickOrder,
} from "@/services/orders";
import type { NotificationDeliveryResult, Product, RawOrderRow } from "@/types";

const productFixtures: Product[] = [
  {
    id: "SERUM-01",
    slug: "serum-phuc-hoi",
    name: "Serum Phuc Hoi",
    shortDescription: "Lam diu",
    description: "Mo ta",
    category: "Serum",
    concerns: ["phuc hoi"],
    price: 420000,
    compareAtPrice: null,
    imageUrl: "https://example.com/serum.jpg",
    galleryUrls: [],
    status: "active",
    stockStatus: "in_stock",
    isFeatured: true,
    displayOrder: 1,
    searchKeywords: ["phuc hoi"],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "TONER-02",
    slug: "toner-diu-da",
    name: "Toner Diu Da",
    shortDescription: "Cap am",
    description: "Mo ta",
    category: "Toner",
    concerns: ["cap am"],
    price: 280000,
    compareAtPrice: null,
    imageUrl: "https://example.com/toner.jpg",
    galleryUrls: [],
    status: "active",
    stockStatus: "preorder",
    isFeatured: false,
    displayOrder: 2,
    searchKeywords: ["cap am"],
    createdAt: null,
    updatedAt: null,
  },
];

const existingOrderRow: RawOrderRow = {
  order_id: "ORD-20260418-AAAAAA",
  created_at: "2026-04-18T09:00:00.000Z",
  phone: "0912345678",
  customer_name: "Lan",
  selected_product_ids: "SERUM-01|TONER-02",
  selected_product_names: "Serum Phuc Hoi|Toner Diu Da",
  item_count: "2",
  customer_note: "",
  status: "new",
  admin_note: "",
  source_page: "listing",
  source_campaign: "",
  duplicate_flag: "false",
  client_fingerprint: "",
  processed_at: "",
};

test("normalizeOrderPayload normalizes Vietnam phone and product ids", () => {
  const payload = normalizeOrderPayload({
    phone: "+84 912 345 678",
    customerName: "  Lan  ",
    selectedProductIds: [" TONER-02 ", "SERUM-01", "SERUM-01"],
    note: "  Can tu van  ",
    sourcePage: " listing ",
    sourceCampaign: " facebook ",
  });

  assert.equal(payload.phone, "0912345678");
  assert.equal(payload.customerName, "Lan");
  assert.deepEqual(payload.selectedProductIds, ["SERUM-01", "TONER-02"]);
  assert.equal(payload.note, "Can tu van");
  assert.equal(payload.sourcePage, "listing");
  assert.equal(payload.sourceCampaign, "facebook");
});

test("normalizeOrderPayload rejects invalid quick order payload", () => {
  assert.throws(
    () =>
      normalizeOrderPayload({
        phone: "123",
        selectedProductIds: [],
      }),
    (error: unknown) =>
      error instanceof OrderSubmissionError && error.code === "INVALID_ORDER_PAYLOAD"
  );
});

test("isDuplicateOrderCandidate matches same phone and same product set within duplicate window", () => {
  const duplicate = isDuplicateOrderCandidate(
    {
      phone: "0912345678",
      selectedProductIds: ["TONER-02", "SERUM-01"],
      createdAt: new Date("2026-04-18T09:20:00.000Z"),
    },
    [
      {
        phone: "0912345678",
        selectedProductIds: ["SERUM-01", "TONER-02"],
        createdAt: "2026-04-18T09:00:00.000Z",
        status: "new",
      },
    ],
    30
  );

  assert.equal(duplicate, true);
});

test("submitQuickOrder classifies duplicate orders and appends structured row", async () => {
  const appendedRows: string[][] = [];
  const notifications: NotificationDeliveryResult[] = [];

  const result = await submitQuickOrder(
    {
      phone: "0912345678",
      customerName: "Lan",
      selectedProductIds: ["SERUM-01", "TONER-02"],
      note: "Da nhay cam",
      sourcePage: "listing",
    },
    {
      appendRow: async (_tabName, row) => {
        appendedRows.push(row);
      },
      getProducts: async () => productFixtures,
      notifyOrderCreated: async () => {
        const notification: NotificationDeliveryResult = {
          status: "sent",
          code: "NOTIFICATION_SENT",
          message: "sent",
        };
        notifications.push(notification);
        return notification;
      },
      readOrders: async () => [existingOrderRow],
      now: () => new Date("2026-04-18T09:20:00.000Z"),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.status, "duplicate");
  assert.equal(result.duplicate, true);
  assert.equal(appendedRows.length, 1);
  assert.equal(appendedRows[0]?.[2], "0912345678");
  assert.equal(appendedRows[0]?.[5], "Serum Phuc Hoi|Toner Diu Da");
  assert.equal(appendedRows[0]?.[8], "duplicate");
  assert.equal(appendedRows[0]?.[12], "true");
  assert.equal(result.notification.status, "sent");
  assert.equal(notifications.length, 1);
});

test("submitQuickOrder rejects out-of-stock products before writing", async () => {
  await assert.rejects(
    () =>
      submitQuickOrder(
        {
          phone: "0912345678",
          selectedProductIds: ["SERUM-01"],
        },
        {
          appendRow: async () => undefined,
          getProducts: async () => [
            {
              ...productFixtures[0],
              stockStatus: "out_of_stock",
            },
          ],
          notifyOrderCreated: async () => ({
            status: "sent",
            code: "NOTIFICATION_SENT",
            message: "sent",
          }),
          readOrders: async () => [],
          now: () => new Date("2026-04-18T09:20:00.000Z"),
        }
      ),
    (error: unknown) =>
      error instanceof OrderSubmissionError && error.code === "PRODUCT_OUT_OF_STOCK"
  );
});

test("submitQuickOrder returns degraded success when notification delivery fails", async () => {
  const result = await submitQuickOrder(
    {
      phone: "0912345678",
      selectedProductIds: ["SERUM-01"],
    },
    {
      appendRow: async () => undefined,
      getProducts: async () => [productFixtures[0]],
      notifyOrderCreated: async () => ({
        status: "failed",
        code: "NOTIFICATION_DELIVERY_FAILED",
        message: "failed",
      }),
      readOrders: async () => [],
      now: () => new Date("2026-04-18T09:20:00.000Z"),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.notification.status, "failed");
  assert.match(result.warning ?? "", /email/i);
});

test("normalizeOrderListItem converts raw order row into admin-friendly fields", () => {
  const item = normalizeOrderListItem(existingOrderRow);

  assert.equal(item.orderId, "ORD-20260418-AAAAAA");
  assert.equal(item.phone, "0912345678");
  assert.deepEqual(item.selectedProductIds, ["SERUM-01", "TONER-02"]);
  assert.equal(item.itemCount, 2);
  assert.equal(item.duplicateFlag, false);
});

test("listAdminOrders filters by duplicate flag and search query", async () => {
  const items = await listAdminOrders(
    {
      q: "0912",
      duplicate: true,
    },
    {
      readOrders: async () => [
        {
          ...existingOrderRow,
          duplicate_flag: "true",
          status: "duplicate",
        },
        existingOrderRow,
      ],
    }
  );

  assert.equal(items.length, 1);
  assert.equal(items[0]?.status, "duplicate");
  assert.equal(items[0]?.duplicateFlag, true);
});

test("updateAdminOrder persists mutable fields and sets processed timestamp", async () => {
  const updatedRows: Array<{ rowNumber: number; row: string[] }> = [];

  const updated = await updateAdminOrder(
    "ORD-20260418-AAAAAA",
    {
      status: "contacted",
      adminNote: "Da goi xac nhan",
    },
    {
      readOrdersWithIndex: async () => [
        {
          rowNumber: 3,
          row: existingOrderRow,
        },
      ],
      updateRow: async (_tabName, rowNumber, row) => {
        updatedRows.push({ rowNumber, row });
      },
      now: () => new Date("2026-04-18T10:00:00.000Z"),
    }
  );

  assert.equal(updated.status, "contacted");
  assert.equal(updated.adminNote, "Da goi xac nhan");
  assert.equal(updated.processedAt, "2026-04-18T10:00:00.000Z");
  assert.equal(updatedRows[0]?.rowNumber, 3);
  assert.equal(updatedRows[0]?.row[8], "contacted");
  assert.equal(updatedRows[0]?.row[9], "Da goi xac nhan");
});

test("updateAdminOrder returns not found for missing order id", async () => {
  await assert.rejects(
    () =>
      updateAdminOrder(
        "ORD-MISSING",
        {
          status: "contacted",
        },
        {
          readOrdersWithIndex: async () => [],
        }
      ),
    (error: unknown) => error instanceof OrderAdminError && error.code === "ORDER_NOT_FOUND"
  );
});

test("createAdminOrder creates an internal order row and returns normalized order detail", async () => {
  const appendedRows: string[][] = [];

  const order = await createAdminOrder(
    {
      phone: "0912345678",
      customerName: "Lan",
      selectedProductIds: ["SERUM-01"],
      note: "Khach tao boi admin",
      sourcePage: "admin_manual",
      sourceCampaign: "hotline",
    },
    {
      appendRow: async (_tabName, row) => {
        appendedRows.push(row);
      },
      getProducts: async () => [productFixtures[0]],
      readOrders: async () => [],
      now: () => new Date("2026-04-18T10:30:00.000Z"),
    }
  );

  assert.equal(order.phone, "0912345678");
  assert.equal(order.status, "new");
  assert.equal(order.sourcePage, "admin_manual");
  assert.equal(appendedRows.length, 1);
  assert.equal(appendedRows[0]?.[10], "admin_manual");
});
