import test from "node:test";
import assert from "node:assert/strict";

import { normalizeProductRow } from "@/services/products";
import type { RawProductRow } from "@/types";

const baseRow: RawProductRow = {
  product_id: "SERUM-01",
  slug: "serum-phuc-hoi",
  name: "Serum phuc hoi",
  short_description: "Lam diu nhanh",
  description: "Mo ta chi tiet",
  category: "Serum",
  skin_concern: "Phuc hoi|Da nhay cam",
  price: "420000",
  compare_at_price: "490000",
  image_url: "https://example.com/serum.jpg",
  gallery_urls: "https://example.com/1.jpg|https://example.com/2.jpg",
  tiktok_url: "https://www.tiktok.com/@lanemglow/video/7481234567890123456",
  status: "active",
  stock_status: "in_stock",
  is_featured: "true",
  display_order: "2",
  search_keywords: "serum, barrier, phuc hoi",
  created_at: "2026-04-18T10:00:00.000Z",
  updated_at: "2026-04-18T11:00:00.000Z",
};

test("normalizeProductRow converts raw product values into typed fields", () => {
  const product = normalizeProductRow(baseRow);

  assert.equal(product.id, "SERUM-01");
  assert.equal(product.price, 420000);
  assert.equal(product.compareAtPrice, 490000);
  assert.equal(product.isFeatured, true);
  assert.equal(product.stockStatus, "in_stock");
  assert.deepEqual(product.galleryUrls, [
    "https://example.com/1.jpg",
    "https://example.com/2.jpg",
  ]);
  assert.equal(product.tiktokUrl, "https://www.tiktok.com/@lanemglow/video/7481234567890123456");
  assert.deepEqual(product.concerns, ["phuc hoi", "da nhay cam"]);
  assert.deepEqual(product.searchKeywords, ["serum", "barrier", "phuc hoi"]);
});

test("normalizeProductRow neutralizes invalid TikTok URLs from sheet rows", () => {
  const product = normalizeProductRow({
    ...baseRow,
    tiktok_url: "notaurl",
  });

  assert.equal(product.tiktokUrl, null);
});

test("normalizeProductRow rejects invalid stock status", () => {
  assert.throws(() => {
    normalizeProductRow({
      ...baseRow,
      stock_status: "invalid",
    });
  }, /Invalid product stock status/);
});
