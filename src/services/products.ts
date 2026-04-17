import { withCache } from "@/lib/cache";
import { assertRequiredHeaders, readSheetRows } from "@/lib/sheets";
import {
  isProductStatus,
  isProductStockStatus,
  parseBoolean,
  parseDelimitedList,
  parseOptionalDateString,
  parseOptionalNumber,
  parseRequiredNumber,
} from "@/lib/validation";
import type { Product, ProductCatalogQuery, ProductStatus, RawProductRow } from "@/types";

const PRODUCTS_SHEET = "products";
const PRODUCT_REQUIRED_HEADERS = [
  "product_id",
  "slug",
  "name",
  "short_description",
  "description",
  "category",
  "skin_concern",
  "price",
  "compare_at_price",
  "image_url",
  "gallery_urls",
  "status",
  "stock_status",
  "is_featured",
  "display_order",
  "search_keywords",
  "created_at",
  "updated_at",
] as const;

function normalizeProductStatus(value: string): ProductStatus {
  if (!isProductStatus(value)) {
    throw new Error(`Invalid product status: ${value}`);
  }

  return value;
}

function normalizeConcerns(value: string): string[] {
  return parseDelimitedList(value).map((item) => item.toLowerCase());
}

function normalizeKeywords(value: string): string[] {
  return parseDelimitedList(value).map((item) => item.toLowerCase());
}

export function normalizeProductRow(row: RawProductRow): Product {
  const status = normalizeProductStatus(row.status.trim().toLowerCase());
  const stockStatusRaw = row.stock_status.trim().toLowerCase();

  if (!isProductStockStatus(stockStatusRaw)) {
    throw new Error(`Invalid product stock status: ${row.stock_status}`);
  }

  return {
    id: row.product_id.trim(),
    slug: row.slug.trim(),
    name: row.name.trim(),
    shortDescription: row.short_description.trim(),
    description: row.description.trim(),
    category: row.category.trim(),
    concerns: normalizeConcerns(row.skin_concern),
    price: parseRequiredNumber(row.price, "price"),
    compareAtPrice: parseOptionalNumber(row.compare_at_price),
    imageUrl: row.image_url.trim(),
    galleryUrls: parseDelimitedList(row.gallery_urls),
    status,
    stockStatus: stockStatusRaw,
    isFeatured: parseBoolean(row.is_featured),
    displayOrder: parseRequiredNumber(row.display_order, "display_order"),
    searchKeywords: normalizeKeywords(row.search_keywords),
    createdAt: parseOptionalDateString(row.created_at),
    updatedAt: parseOptionalDateString(row.updated_at),
  };
}

function sortProducts(products: Product[]): Product[] {
  return [...products].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    const leftUpdatedAt = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
    const rightUpdatedAt = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;

    if (leftUpdatedAt !== rightUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt;
    }

    return left.name.localeCompare(right.name);
  });
}

function matchesQuery(product: Product, query: ProductCatalogQuery): boolean {
  if (query.category && product.category.toLowerCase() !== query.category.toLowerCase()) {
    return false;
  }

  if (query.concern) {
    const concern = query.concern.toLowerCase();
    if (!product.concerns.some((item) => item === concern)) {
      return false;
    }
  }

  if (typeof query.featured === "boolean" && product.isFeatured !== query.featured) {
    return false;
  }

  if (query.stockStatus && product.stockStatus !== query.stockStatus) {
    return false;
  }

  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    const haystacks = [
      product.name,
      product.category,
      product.shortDescription,
      ...product.concerns,
      ...product.searchKeywords,
    ].map((value) => value.toLowerCase());

    if (!haystacks.some((value) => value.includes(searchTerm))) {
      return false;
    }
  }

  return true;
}

async function loadProductsFromSheets(): Promise<Product[]> {
  const rows = (await readSheetRows(PRODUCTS_SHEET)) as RawProductRow[];
  assertRequiredHeaders(rows, [...PRODUCT_REQUIRED_HEADERS]);

  return sortProducts(
    rows
      .map((row) => normalizeProductRow(row))
      .filter((product) => product.status === "active")
  );
}

export async function getCatalogProducts(options?: { skipCache?: boolean }): Promise<Product[]> {
  return withCache("catalog:all", loadProductsFromSheets, {
    skipCache: options?.skipCache,
  });
}

export async function listCatalogProducts(
  query: ProductCatalogQuery,
  options?: { skipCache?: boolean }
): Promise<Product[]> {
  const products = await getCatalogProducts(options);
  return products.filter((product) => matchesQuery(product, query));
}

export async function getCatalogProductBySlug(
  slug: string,
  options?: { skipCache?: boolean }
): Promise<Product | null> {
  const products = await getCatalogProducts(options);
  return products.find((product) => product.slug === slug) ?? null;
}
