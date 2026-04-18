import assert from "node:assert/strict";
import test from "node:test";

import {
  archiveAdminProduct,
  createAdminProduct,
  listAdminProducts,
  normalizeProductAdminInput,
  parseProductAdminQuery,
  ProductAdminError,
  updateAdminProduct,
} from "@/services/admin-products";
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

function buildDependencies(rows: Array<{ rowNumber: number; row: RawProductRow }>) {
  const store = [...rows];

  return {
    appendRow: async (_tabName: string, row: string[]) => {
      store.push({
        rowNumber: store.length + 2,
        row: {
          product_id: row[0] ?? "",
          slug: row[1] ?? "",
          name: row[2] ?? "",
          short_description: row[3] ?? "",
          description: row[4] ?? "",
          category: row[5] ?? "",
          skin_concern: row[6] ?? "",
          price: row[7] ?? "",
          compare_at_price: row[8] ?? "",
          image_url: row[9] ?? "",
          gallery_urls: row[10] ?? "",
          tiktok_url: row[11] ?? "",
          status: row[12] ?? "",
          stock_status: row[13] ?? "",
          is_featured: row[14] ?? "",
          display_order: row[15] ?? "",
          search_keywords: row[16] ?? "",
          created_at: row[17] ?? "",
          updated_at: row[18] ?? "",
        },
      });
    },
    now: () => new Date("2026-04-19T08:00:00.000Z"),
    readProductsWithIndex: async () => store,
    updateRow: async (_tabName: string, rowNumber: number, row: string[]) => {
      const index = store.findIndex((item) => item.rowNumber === rowNumber);
      store[index] = {
        rowNumber,
        row: {
          product_id: row[0] ?? "",
          slug: row[1] ?? "",
          name: row[2] ?? "",
          short_description: row[3] ?? "",
          description: row[4] ?? "",
          category: row[5] ?? "",
          skin_concern: row[6] ?? "",
          price: row[7] ?? "",
          compare_at_price: row[8] ?? "",
          image_url: row[9] ?? "",
          gallery_urls: row[10] ?? "",
          tiktok_url: row[11] ?? "",
          status: row[12] ?? "",
          stock_status: row[13] ?? "",
          is_featured: row[14] ?? "",
          display_order: row[15] ?? "",
          search_keywords: row[16] ?? "",
          created_at: row[17] ?? "",
          updated_at: row[18] ?? "",
        },
      };
    },
  };
}

test("normalizeProductAdminInput normalizes admin product payload", () => {
  const payload = normalizeProductAdminInput({
    productId: " SERUM-02 ",
    slug: " Serum Phuc Hoi Moi ",
    name: " Serum Moi ",
    shortDescription: " phuc hoi nhanh ",
    description: "mo ta",
    category: " Serum ",
    concerns: "Phuc Hoi, Phuc Hoi, Da Nhay Cam",
    price: "520000",
    compareAtPrice: "",
    imageUrl: "https://example.com/new.jpg",
    galleryUrls: "https://example.com/1.jpg, https://example.com/2.jpg",
    tiktokUrl: "https://www.tiktok.com/@lanemglow/video/7482222222222222222",
    status: "active",
    stockStatus: "preorder",
    isFeatured: true,
    displayOrder: "4",
    searchKeywords: "serum, serum, calming",
  });

  assert.equal(payload.slug, "serum-phuc-hoi-moi");
  assert.deepEqual(payload.concerns, ["phuc hoi", "da nhay cam"]);
  assert.deepEqual(payload.searchKeywords, ["serum", "calming"]);
  assert.equal(payload.compareAtPrice, null);
  assert.equal(payload.tiktokUrl, "https://www.tiktok.com/@lanemglow/video/7482222222222222222");
});

test("normalizeProductAdminInput rejects invalid TikTok URL payloads", () => {
  assert.throws(
    () =>
      normalizeProductAdminInput({
        productId: "SERUM-02",
        slug: "Serum moi",
        name: "Serum Moi",
        shortDescription: "Mo ta ngan",
        description: "Mo ta dai",
        category: "Serum",
        concerns: "phuc hoi",
        price: "520000",
        compareAtPrice: "",
        imageUrl: "https://example.com/new.jpg",
        galleryUrls: "https://example.com/1.jpg",
        tiktokUrl: "https://youtube.com/watch?v=abc",
        status: "active",
        stockStatus: "in_stock",
        isFeatured: false,
        displayOrder: "3",
        searchKeywords: "serum",
      }),
    /TikTok URL không hợp lệ/i
  );
});

test("parseProductAdminQuery rejects unsupported product status filter", () => {
  assert.throws(() => parseProductAdminQuery({ status: "draft" }), ProductAdminError);
});

test("listAdminProducts filters by query and status", async () => {
  const items = await listAdminProducts(
    {
      q: "serum",
      status: "active",
    },
    buildDependencies([{ rowNumber: 2, row: baseRow }])
  );

  assert.equal(items.length, 1);
  assert.equal(items[0]?.id, "SERUM-01");
});

test("createAdminProduct rejects duplicate product ids and slugs", async () => {
  await assert.rejects(
    () =>
      createAdminProduct(
        {
          productId: "SERUM-01",
          slug: "serum-phuc-hoi",
          name: "Serum moi",
          shortDescription: "Mo ta",
          description: "Chi tiet",
          category: "Serum",
          concerns: "phuc hoi",
          price: "510000",
          compareAtPrice: "",
          imageUrl: "https://example.com/new.jpg",
          galleryUrls: "https://example.com/new-1.jpg",
          tiktokUrl: null,
          status: "active",
          stockStatus: "in_stock",
          isFeatured: false,
          displayOrder: "3",
          searchKeywords: "serum",
        },
        buildDependencies([{ rowNumber: 2, row: baseRow }])
      ),
    /đã tồn tại/i
  );
});

test("createAdminProduct appends a new product row and returns normalized product", async () => {
  const product = await createAdminProduct(
    {
      productId: "SERUM-02",
      slug: "serum-moi",
      name: "Serum moi",
      shortDescription: "Mo ta ngan",
      description: "Mo ta dai",
      category: "Serum",
      concerns: "phuc hoi, da nhay cam",
      price: "510000",
      compareAtPrice: "560000",
      imageUrl: "https://example.com/new.jpg",
      galleryUrls: "https://example.com/new-1.jpg,https://example.com/new-2.jpg",
      tiktokUrl: "https://www.tiktok.com/@lanemglow/video/7483333333333333333",
      status: "active",
      stockStatus: "in_stock",
      isFeatured: false,
      displayOrder: "3",
      searchKeywords: "serum, calming",
    },
    buildDependencies([{ rowNumber: 2, row: baseRow }])
  );

  assert.equal(product.id, "SERUM-02");
  assert.equal(product.rowNumber, 3);
  assert.equal(product.tiktokUrl, "https://www.tiktok.com/@lanemglow/video/7483333333333333333");
  assert.equal(product.updatedAt, "2026-04-19T08:00:00.000Z");
});

test("updateAdminProduct preserves immutable product id and updates mutable fields", async () => {
  const product = await updateAdminProduct(
    "SERUM-01",
    {
      productId: "SERUM-01",
      slug: "serum-phuc-hoi-moi",
      name: "Serum phuc hoi moi",
      shortDescription: "Mo ta ngan moi",
      description: "Mo ta dai moi",
      category: "Serum",
      concerns: "phuc hoi",
      price: "430000",
      compareAtPrice: "",
      imageUrl: "https://example.com/new.jpg",
      galleryUrls: "https://example.com/new-1.jpg",
      tiktokUrl: null,
      status: "inactive",
      stockStatus: "preorder",
      isFeatured: false,
      displayOrder: "5",
      searchKeywords: "serum, repair",
    },
    buildDependencies([{ rowNumber: 2, row: baseRow }])
  );

  assert.equal(product.id, "SERUM-01");
  assert.equal(product.slug, "serum-phuc-hoi-moi");
  assert.equal(product.status, "inactive");
  assert.equal(product.displayOrder, 5);
  assert.equal(product.createdAt, "2026-04-18T10:00:00.000Z");
  assert.equal(product.updatedAt, "2026-04-19T08:00:00.000Z");
});

test("updateAdminProduct rejects attempts to change immutable product id", async () => {
  await assert.rejects(
    () =>
      updateAdminProduct(
        "SERUM-01",
        {
          productId: "SERUM-99",
          slug: "serum-phuc-hoi",
          name: "Serum phuc hoi",
          shortDescription: "Mo ta ngan",
          description: "Mo ta dai",
          category: "Serum",
          concerns: "phuc hoi",
          price: "430000",
          compareAtPrice: "",
          imageUrl: "https://example.com/new.jpg",
          galleryUrls: "https://example.com/new-1.jpg",
          tiktokUrl: null,
          status: "active",
          stockStatus: "in_stock",
          isFeatured: false,
          displayOrder: "5",
          searchKeywords: "serum",
        },
        buildDependencies([{ rowNumber: 2, row: baseRow }])
      ),
    /không thể thay đổi mã sản phẩm/i
  );
});

test("archiveAdminProduct marks product status as inactive without removing the row", async () => {
  const product = await archiveAdminProduct(
    "SERUM-01",
    buildDependencies([{ rowNumber: 2, row: baseRow }])
  );

  assert.equal(product.id, "SERUM-01");
  assert.equal(product.status, "inactive");
});
