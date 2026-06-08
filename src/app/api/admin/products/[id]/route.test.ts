import assert from "node:assert/strict";
import test from "node:test";

import { PATCH } from "@/app/api/admin/products/[id]/route";
import {
  resetArchiveAdminProductHandlerForTesting,
  resetUpdateAdminProductHandlerForTesting,
  setArchiveAdminProductHandlerForTesting,
  setUpdateAdminProductHandlerForTesting,
} from "@/app/api/admin/products/[id]/handlers";
import { ProductAdminError } from "@/services/admin-products";
import type { ProductAdminListItem } from "@/types";

const product: ProductAdminListItem = {
  rowNumber: 2,
  id: "SERUM-01",
  slug: "serum-phuc-hoi",
  name: "Serum phuc hoi",
  shortDescription: "Mo ta ngan",
  description: "Mo ta dai",
  category: "Serum",
  brand: "La Roche-Posay",
  concerns: ["phuc hoi"],
  price: 420000,
  compareAtPrice: 490000,
  imageUrl: "https://example.com/serum.jpg",
  galleryUrls: ["https://example.com/1.jpg"],
  tiktokUrl: null,
  status: "active",
  stockStatus: "in_stock",
  isFeatured: true,
  displayOrder: 2,
  searchKeywords: ["serum"],
  createdAt: "2026-04-18T10:00:00.000Z",
  updatedAt: "2026-04-18T11:00:00.000Z",
  quantity: 5,
};

test("PATCH /api/admin/products/[id] returns 400 for invalid JSON", async () => {
  const request = new Request("http://localhost:3000/api/admin/products/SERUM-01", {
    method: "PATCH",
    body: "{bad",
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await PATCH(request, {
    params: Promise.resolve({ id: "SERUM-01" }),
  });
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_JSON");
});

test("PATCH /api/admin/products/[id] returns updated product payload", async () => {
  setUpdateAdminProductHandlerForTesting(async () => ({
    ...product,
    name: "Serum moi",
  }));

  const request = new Request("http://localhost:3000/api/admin/products/SERUM-01", {
    method: "PATCH",
    body: JSON.stringify({ name: "Serum moi" }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await PATCH(request, {
    params: Promise.resolve({ id: "SERUM-01" }),
  });
  const payload = (await response.json()) as { product: ProductAdminListItem };

  assert.equal(response.status, 200);
  assert.equal(payload.product.name, "Serum moi");

  resetUpdateAdminProductHandlerForTesting();
});

test("PATCH /api/admin/products/[id] maps admin update errors", async () => {
  setUpdateAdminProductHandlerForTesting(async () => {
    throw new ProductAdminError("Khong tim thay san pham.", {
      statusCode: 404,
      code: "PRODUCT_NOT_FOUND",
    });
  });

  const request = new Request("http://localhost:3000/api/admin/products/SERUM-01", {
    method: "PATCH",
    body: JSON.stringify({ name: "Serum moi" }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await PATCH(request, {
    params: Promise.resolve({ id: "SERUM-01" }),
  });
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 404);
  assert.equal(payload.code, "PRODUCT_NOT_FOUND");

  resetUpdateAdminProductHandlerForTesting();
});

test("DELETE /api/admin/products/[id] returns archived product payload", async () => {
  const { DELETE } = await import("@/app/api/admin/products/[id]/route");

  setArchiveAdminProductHandlerForTesting(async () => ({
    ...product,
    status: "inactive",
  }));

  const response = await DELETE(new Request("http://localhost:3000/api/admin/products/SERUM-01"), {
    params: Promise.resolve({ id: "SERUM-01" }),
  });
  const payload = (await response.json()) as { product: ProductAdminListItem };

  assert.equal(response.status, 200);
  assert.equal(payload.product.status, "inactive");

  resetArchiveAdminProductHandlerForTesting();
});
