import type { ProductStockStatus, ProductStatus } from "@/types";

const PRODUCT_STATUSES: ProductStatus[] = ["active", "inactive"];
const PRODUCT_STOCK_STATUSES: ProductStockStatus[] = [
  "in_stock",
  "out_of_stock",
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

export function parseOptionalNumber(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null) {
    return null;
  }
  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseRequiredNumber(value: string | number | undefined | null, field: string): number {
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

const VIETNAM_MOBILE_PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;

export function isVietnamMobilePhone(value: string): boolean {
  return VIETNAM_MOBILE_PHONE_REGEX.test(value.trim());
}

export function normalizeVietnamPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    throw new Error("Phone number is required.");
  }

  let normalized = digits;

  if (normalized.startsWith("84")) {
    normalized = `0${normalized.slice(2)}`;
  }

  if (!isVietnamMobilePhone(normalized)) {
    throw new Error("Phone number must match Vietnam mobile format.");
  }

  return normalized;
}

export function parseNonEmptyStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new Error("Selected product ids must be an array.");
  }

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  if (items.length === 0) {
    throw new Error("At least one selected product is required.");
  }

  return Array.from(new Set(items));
}
