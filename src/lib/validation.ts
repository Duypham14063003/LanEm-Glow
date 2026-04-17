import type { ProductStockStatus, ProductStatus } from "@/types";

const PRODUCT_STATUSES: ProductStatus[] = ["active", "inactive"];
const PRODUCT_STOCK_STATUSES: ProductStockStatus[] = [
  "in_stock",
  "out_of_stock",
  "preorder",
];

export function isProductStatus(value: string): value is ProductStatus {
  return PRODUCT_STATUSES.includes(value as ProductStatus);
}

export function isProductStockStatus(value: string): value is ProductStockStatus {
  return PRODUCT_STOCK_STATUSES.includes(value as ProductStockStatus);
}

export function parseDelimitedList(value: string, delimiters = /[|,]/): string[] {
  return value
    .split(delimiters)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseBoolean(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return ["true", "1", "yes", "y"].includes(normalized);
}

export function parseOptionalNumber(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseRequiredNumber(value: string, field: string): number {
  const parsed = parseOptionalNumber(value);

  if (parsed === null) {
    throw new Error(`Invalid number for field "${field}"`);
  }

  return parsed;
}

export function parseOptionalDateString(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export function assertRequiredEnv(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
