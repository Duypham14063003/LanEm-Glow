import { invalidateCache } from "@/lib/cache";
import { normalizeTikTokUrl } from "@/lib/tiktok";
import {
  isProductStatus,
  isProductStockStatus,
  parseBoolean,
  parseDelimitedList,
  parseOptionalNumber,
  parseRequiredNumber,
} from "@/lib/validation";
import {
  appendSheetRow,
  assertRequiredHeaders,
  readSheetRowsWithIndex,
  updateSheetRow,
} from "@/lib/sheets";
import { normalizeProductRow } from "@/services/products";
import type {
  ProductAdminListItem,
  ProductAdminMutationInput,
  ProductAdminQuery,
  ProductStatus,
  RawProductRow,
} from "@/types";

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
  "tiktok_url",
  "status",
  "stock_status",
  "is_featured",
  "display_order",
  "search_keywords",
  "created_at",
  "updated_at",
] as const;

type IndexedProductRow = {
  rowNumber: number;
  row: RawProductRow;
};

type AdminProductsDependencies = {
  appendRow: (tabName: string, row: string[]) => Promise<void>;
  now: () => Date;
  readProductsWithIndex: () => Promise<IndexedProductRow[]>;
  updateRow: (tabName: string, rowNumber: number, row: string[]) => Promise<void>;
};

const defaultDependencies: AdminProductsDependencies = {
  appendRow: appendSheetRow,
  now: () => new Date(),
  readProductsWithIndex: async () => {
    const rows = await readSheetRowsWithIndex(PRODUCTS_SHEET);
    const normalizedRows = rows.map((row) => ({
      rowNumber: row.rowNumber,
      row: row.record as RawProductRow,
    }));

    assertRequiredHeaders(
      normalizedRows.map((item) => item.row),
      [...PRODUCT_REQUIRED_HEADERS]
    );

    return normalizedRows;
  },
  updateRow: updateSheetRow,
};

export class ProductAdminError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message);
    this.name = "ProductAdminError";
    this.statusCode = options?.statusCode ?? 400;
    this.code = options?.code ?? "PRODUCT_ADMIN_FAILED";
  }
}

export function parseProductAdminQuery(input: {
  q?: string;
  status?: string;
}): ProductAdminQuery {
  const q = input.q?.trim() || undefined;
  const status = input.status?.trim().toLowerCase();

  if (!status) {
    return { q };
  }

  if (!isProductStatus(status)) {
    throw new ProductAdminError("Trạng thái sản phẩm không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_STATUS_FILTER",
    });
  }

  return {
    q,
    status,
  };
}

function normalizeUniqueList(value: unknown, field: string): string[] {
  const source = typeof value === "string" ? value : "";
  const items = parseDelimitedList(source)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (field === "concerns" && items.length === 0) {
    throw new ProductAdminError("Bạn cần nhập ít nhất một concern cho sản phẩm.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }

  return Array.from(new Set(items));
}

function normalizeRequiredText(value: unknown, label: string): string {
  const normalized = typeof value === "string" ? value.trim() : "";

  if (!normalized) {
    throw new ProductAdminError(`${label} là bắt buộc.`, {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }

  return normalized;
}
function normalizeSlug(value: unknown): string {
  const raw = normalizeRequiredText(value, "Slug");
  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    throw new ProductAdminError("Slug không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }

  return normalized;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return parseBoolean(value);
  }

  return false;
}

function normalizeRequiredNumberValue(value: unknown, field: string, label: string): number {
  const normalized = typeof value === "number" ? `${value}` : typeof value === "string" ? value : "";

  try {
    return parseRequiredNumber(normalized, field);
  } catch {
    throw new ProductAdminError(`${label} không hợp lệ.`, {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }
}

function normalizeOptionalNumberValue(value: unknown): number | null {
  const normalized = typeof value === "number" ? `${value}` : typeof value === "string" ? value : "";
  return parseOptionalNumber(normalized);
}

function normalizeOptionalTikTokUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    return normalizeTikTokUrl(value);
  } catch {
    throw new ProductAdminError("TikTok URL không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }
}

function normalizeStatus(value: unknown): ProductStatus {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (!isProductStatus(normalized)) {
    throw new ProductAdminError("Trạng thái sản phẩm không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }

  return normalized;
}

function normalizeStockStatus(value: unknown): ProductAdminMutationInput["stockStatus"] {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (!isProductStockStatus(normalized)) {
    throw new ProductAdminError("Tình trạng tồn kho không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }

  return normalized;
}

export function normalizeProductAdminInput(input: unknown): ProductAdminMutationInput {
  if (!input || typeof input !== "object") {
    throw new ProductAdminError("Dữ liệu sản phẩm không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_PAYLOAD",
    });
  }

  const payload = input as Record<string, unknown>;

  return {
    productId: normalizeRequiredText(payload.productId, "Mã sản phẩm"),
    slug: normalizeSlug(payload.slug),
    name: normalizeRequiredText(payload.name, "Tên sản phẩm"),
    shortDescription: normalizeRequiredText(
      payload.shortDescription,
      "Mô tả ngắn"
    ),
    description: normalizeRequiredText(payload.description, "Mô tả chi tiết"),
    category: normalizeRequiredText(payload.category, "Danh mục"),
    concerns: normalizeUniqueList(payload.concerns, "concerns"),
    price: normalizeRequiredNumberValue(payload.price, "price", "Giá bán"),
    compareAtPrice: normalizeOptionalNumberValue(payload.compareAtPrice),
    imageUrl: normalizeRequiredText(payload.imageUrl, "Ảnh đại diện"),
    galleryUrls: normalizeUniqueList(payload.galleryUrls, "galleryUrls"),
    tiktokUrl: normalizeOptionalTikTokUrl(payload.tiktokUrl),
    status: normalizeStatus(payload.status),
    stockStatus: normalizeStockStatus(payload.stockStatus),
    isFeatured: normalizeBoolean(payload.isFeatured),
    displayOrder: normalizeRequiredNumberValue(payload.displayOrder, "display_order", "Thứ tự hiển thị"),
    searchKeywords: normalizeUniqueList(payload.searchKeywords, "searchKeywords"),
    quantity: normalizeOptionalNumberValue(payload.quantity),
  };
}

function toAdminListItem(rowNumber: number, row: RawProductRow): ProductAdminListItem {
  return {
    rowNumber,
    ...normalizeProductRow(row),
  };
}

function matchesAdminQuery(item: ProductAdminListItem, query: ProductAdminQuery): boolean {
  if (query.status && item.status !== query.status) {
    return false;
  }

  if (query.q) {
    const q = query.q.toLowerCase();
    const haystack = [
      item.id,
      item.slug,
      item.name,
      item.category,
      item.shortDescription,
      ...item.concerns,
      ...item.searchKeywords,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(q)) {
      return false;
    }
  }

  return true;
}

function sortAdminProducts(items: ProductAdminListItem[]): ProductAdminListItem[] {
  return [...items].sort((left, right) => {
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

function assertUniqueProductIdentity(
  items: ProductAdminListItem[],
  input: ProductAdminMutationInput,
  options?: { ignoreProductId?: string }
) {
  const duplicateId = items.find(
    (item) => item.id === input.productId && item.id !== options?.ignoreProductId
  );

  if (duplicateId) {
    throw new ProductAdminError("Mã sản phẩm đã tồn tại.", {
      statusCode: 409,
      code: "DUPLICATE_PRODUCT_ID",
    });
  }

  const duplicateSlug = items.find(
    (item) => item.slug === input.slug && item.id !== options?.ignoreProductId
  );

  if (duplicateSlug) {
    throw new ProductAdminError("Slug sản phẩm đã tồn tại.", {
      statusCode: 409,
      code: "DUPLICATE_PRODUCT_SLUG",
    });
  }
}

function toSheetRow(input: ProductAdminMutationInput, timestamps: { createdAt: string; updatedAt: string }): string[] {
  return [
    input.productId,
    input.slug,
    input.name,
    input.shortDescription,
    input.description,
    input.category,
    input.concerns.join("|"),
    `${input.price}`,
    input.compareAtPrice === null ? "" : `${input.compareAtPrice}`,
    input.imageUrl,
    input.galleryUrls.join("|"),
    input.tiktokUrl ?? "",
    input.status,
    input.stockStatus,
    input.isFeatured ? "true" : "false",
    `${input.displayOrder}`,
    input.searchKeywords.join("|"),
    timestamps.createdAt,
    timestamps.updatedAt,
    input.quantity === null ? "" : `${input.quantity}`,
  ];
}

export async function listAdminProducts(
  query: ProductAdminQuery,
  dependencies: AdminProductsDependencies = defaultDependencies
): Promise<ProductAdminListItem[]> {
  const rows = await dependencies.readProductsWithIndex();
  const items = rows.map((entry) => toAdminListItem(entry.rowNumber, entry.row));
  return sortAdminProducts(items).filter((item) => matchesAdminQuery(item, query));
}

export async function createAdminProduct(
  input: unknown,
  dependencies: AdminProductsDependencies = defaultDependencies
): Promise<ProductAdminListItem> {
  const normalized = normalizeProductAdminInput(input);
  const items = await listAdminProducts({}, dependencies);
  assertUniqueProductIdentity(items, normalized);

  const nowIso = dependencies.now().toISOString();
  await dependencies.appendRow(
    PRODUCTS_SHEET,
    toSheetRow(normalized, {
      createdAt: nowIso,
      updatedAt: nowIso,
    })
  );

  invalidateCache("catalog:all");

  const nextRows = await dependencies.readProductsWithIndex();
  const created = nextRows
    .map((entry) => toAdminListItem(entry.rowNumber, entry.row))
    .find((item) => item.id === normalized.productId);

  if (!created) {
    throw new ProductAdminError("Đã lưu sản phẩm nhưng không thể đọc lại dữ liệu mới.", {
      statusCode: 500,
      code: "PRODUCT_WRITE_FAILED",
    });
  }

  return created;
}

export async function updateAdminProduct(
  productId: string,
  input: unknown,
  dependencies: AdminProductsDependencies = defaultDependencies
): Promise<ProductAdminListItem> {
  const targetId = productId.trim();
  if (!targetId) {
    throw new ProductAdminError("Thiếu mã sản phẩm cần cập nhật.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_ID",
    });
  }

  const normalized = normalizeProductAdminInput(input);
  const rows = await dependencies.readProductsWithIndex();
  const items = rows.map((entry) => toAdminListItem(entry.rowNumber, entry.row));
  const existing = items.find((item) => item.id === targetId);

  if (!existing) {
    throw new ProductAdminError("Không tìm thấy sản phẩm cần cập nhật.", {
      statusCode: 404,
      code: "PRODUCT_NOT_FOUND",
    });
  }

  if (normalized.productId !== targetId) {
    throw new ProductAdminError("Không thể thay đổi mã sản phẩm sau khi đã tạo.", {
      statusCode: 400,
      code: "IMMUTABLE_PRODUCT_ID",
    });
  }

  assertUniqueProductIdentity(items, normalized, {
    ignoreProductId: targetId,
  });

  await dependencies.updateRow(
    PRODUCTS_SHEET,
    existing.rowNumber,
    toSheetRow(normalized, {
      createdAt: existing.createdAt ?? dependencies.now().toISOString(),
      updatedAt: dependencies.now().toISOString(),
    })
  );

  invalidateCache("catalog:all");

  const nextRows = await dependencies.readProductsWithIndex();
  const updated = nextRows
    .map((entry) => toAdminListItem(entry.rowNumber, entry.row))
    .find((item) => item.id === normalized.productId);

  if (!updated) {
    throw new ProductAdminError("Đã cập nhật nhưng không thể đọc lại sản phẩm.", {
      statusCode: 500,
      code: "PRODUCT_WRITE_FAILED",
    });
  }

  return updated;
}

export async function archiveAdminProduct(
  productId: string,
  dependencies: AdminProductsDependencies = defaultDependencies
): Promise<ProductAdminListItem> {
  const targetId = productId.trim();
  if (!targetId) {
    throw new ProductAdminError("Thiếu mã sản phẩm cần cập nhật.", {
      statusCode: 400,
      code: "INVALID_PRODUCT_ID",
    });
  }

  const rows = await dependencies.readProductsWithIndex();
  const existing = rows.find((entry) => entry.row.product_id.trim() === targetId);

  if (!existing) {
    throw new ProductAdminError("Không tìm thấy sản phẩm cần cập nhật.", {
      statusCode: 404,
      code: "PRODUCT_NOT_FOUND",
    });
  }

  const current = toAdminListItem(existing.rowNumber, existing.row);
  const archivedInput: ProductAdminMutationInput = {
    productId: current.id,
    slug: current.slug,
    name: current.name,
    shortDescription: current.shortDescription,
    description: current.description,
    category: current.category,
    concerns: current.concerns,
    price: current.price,
    compareAtPrice: current.compareAtPrice,
    imageUrl: current.imageUrl,
    galleryUrls: current.galleryUrls,
    tiktokUrl: current.tiktokUrl,
    status: "inactive",
    stockStatus: current.stockStatus,
    isFeatured: current.isFeatured,
    displayOrder: current.displayOrder,
    searchKeywords: current.searchKeywords,
    quantity: current.quantity,
  };

  await dependencies.updateRow(
    PRODUCTS_SHEET,
    existing.rowNumber,
    toSheetRow(archivedInput, {
      createdAt: current.createdAt ?? dependencies.now().toISOString(),
      updatedAt: dependencies.now().toISOString(),
    })
  );

  invalidateCache("catalog:all");

  return {
    ...current,
    status: "inactive",
    updatedAt: dependencies.now().toISOString(),
  };
}
