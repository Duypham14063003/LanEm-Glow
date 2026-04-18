import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import { GET, POST } from "@/app/api/admin/products/route";
import {
  resetCreateAdminProductHandlerForTesting,
  resetListAdminProductsHandlerForTesting,
  setCreateAdminProductHandlerForTesting,
  setListAdminProductsHandlerForTesting,
} from "@/app/api/admin/products/handlers";
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
};

test("GET /api/admin/products returns normalized admin product list", async () => {
  setListAdminProductsHandlerForTesting(async () => [product]);

  const response = await GET(new NextRequest("http://localhost:3000/api/admin/products?q=serum"));
  const payload = (await response.json()) as { items: ProductAdminListItem[]; total: number };

  assert.equal(response.status, 200);
  assert.equal(payload.total, 1);
  assert.equal(payload.items[0]?.id, "SERUM-01");

  resetListAdminProductsHandlerForTesting();
});

test("GET /api/admin/products maps invalid filter errors", async () => {
  setListAdminProductsHandlerForTesting(async () => {
    throw new ProductAdminError("Trang thai khong hop le.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_STATUS_FILTER",
    });
  });

  const response = await GET(new NextRequest("http://localhost:3000/api/admin/products?status=bad"));
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_PRODUCT_STATUS_FILTER");

  resetListAdminProductsHandlerForTesting();
});

test("POST /api/admin/products returns 400 for invalid JSON", async () => {
  const request = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    body: "{bad",
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await POST(request);
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_JSON");
});

test("POST /api/admin/products returns 201 for successful product creation", async () => {
  setCreateAdminProductHandlerForTesting(async () => product);

  const request = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    body: JSON.stringify({ name: "Serum" }),
    headers: {
      "content-type": "application/json",
    },
  });

  const response = await POST(request);
  const payload = (await response.json()) as { product: ProductAdminListItem };

  assert.equal(response.status, 201);
  assert.equal(payload.product.id, "SERUM-01");

  resetCreateAdminProductHandlerForTesting();
});
