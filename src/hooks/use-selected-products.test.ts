import test from "node:test";
import assert from "node:assert/strict";

import {
  addSelectedProduct,
  removeSelectedProduct,
  toggleSelectedProduct,
} from "@/hooks/use-selected-products";
import type { Product, SelectedProduct } from "@/types";

const product: Product = {
  id: "P-1",
  slug: "serum-a",
  name: "Serum A",
  shortDescription: "Mo ta ngan",
  description: "Mo ta dai",
  category: "serum",
  concerns: ["phuc hoi"],
  price: 100000,
  compareAtPrice: null,
  imageUrl: "https://example.com/p1.jpg",
  galleryUrls: [],
  tiktokUrl: null,
  status: "active",
  stockStatus: "in_stock",
  isFeatured: true,
  displayOrder: 1,
  searchKeywords: ["serum"],
  createdAt: null,
  updatedAt: null,
};

test("addSelectedProduct deduplicates by product id", () => {
  const once = addSelectedProduct([], product);
  const twice = addSelectedProduct(once, product);

  assert.equal(once.length, 1);
  assert.equal(twice.length, 1);
});

test("toggleSelectedProduct adds and removes the same product", () => {
  const added = toggleSelectedProduct([], product);
  const removed = toggleSelectedProduct(added, product);

  assert.equal(added.length, 1);
  assert.equal(removed.length, 0);
});

test("removeSelectedProduct removes only the matching product", () => {
  const items: SelectedProduct[] = [
    {
      id: "P-1",
      slug: "serum-a",
      name: "Serum A",
      price: 100000,
      imageUrl: "https://example.com/p1.jpg",
      stockStatus: "in_stock",
    },
    {
      id: "P-2",
      slug: "serum-b",
      name: "Serum B",
      price: 120000,
      imageUrl: "https://example.com/p2.jpg",
      stockStatus: "in_stock",
    },
  ];

  const next = removeSelectedProduct(items, "P-1");

  assert.equal(next.length, 1);
  assert.equal(next[0]?.id, "P-2");
});
