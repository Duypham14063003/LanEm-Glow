import assert from "node:assert/strict";
import test from "node:test";

import {
  isDuplicateOrderCandidate,
  normalizeOrderPayload,
  OrderSubmissionError,
  submitQuickOrder,
} from "@/services/orders";
import type { Product, RawOrderRow } from "@/types";

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
          readOrders: async () => [],
          now: () => new Date("2026-04-18T09:20:00.000Z"),
        }
      ),
    (error: unknown) =>
      error instanceof OrderSubmissionError && error.code === "PRODUCT_OUT_OF_STOCK"
  );
});
