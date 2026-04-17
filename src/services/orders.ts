import { appendSheetRow, assertRequiredHeaders, readSheetRows } from "@/lib/sheets";
import {
  isProductStatus,
  normalizeVietnamPhone,
  parseDelimitedList,
  parseNonEmptyStringArray,
} from "@/lib/validation";
import { getCatalogProducts } from "@/services/products";
import type {
  NormalizedOrderRequestPayload,
  OrderRequestPayload,
  OrderRowSnapshot,
  OrderStatus,
  OrderSubmissionResult,
  Product,
  RawOrderRow,
} from "@/types";

const ORDERS_SHEET = "orders";
const DEFAULT_DUPLICATE_ORDER_WINDOW_MINUTES = 30;
const ORDER_REQUIRED_HEADERS = [
  "order_id",
  "created_at",
  "phone",
  "customer_name",
  "selected_product_ids",
  "selected_product_names",
  "item_count",
  "customer_note",
  "status",
  "admin_note",
  "source_page",
  "source_campaign",
  "duplicate_flag",
  "client_fingerprint",
  "processed_at",
] as const;

type OrderServiceDependencies = {
  appendRow: (tabName: string, row: string[]) => Promise<void>;
  getProducts: (options?: { skipCache?: boolean }) => Promise<Product[]>;
  readOrders: () => Promise<RawOrderRow[]>;
  now: () => Date;
};

const defaultDependencies: OrderServiceDependencies = {
  appendRow: appendSheetRow,
  getProducts: getCatalogProducts,
  readOrders: async () => {
    const rows = (await readSheetRows(ORDERS_SHEET)) as RawOrderRow[];
    assertRequiredHeaders(rows, [...ORDER_REQUIRED_HEADERS]);
    return rows;
  },
  now: () => new Date(),
};

export class OrderSubmissionError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message);
    this.name = "OrderSubmissionError";
    this.statusCode = options?.statusCode ?? 400;
    this.code = options?.code ?? "ORDER_SUBMISSION_FAILED";
  }
}

function getDuplicateWindowMinutes(): number {
  const rawValue = process.env.DUPLICATE_ORDER_WINDOW_MINUTES?.trim();

  if (!rawValue) {
    return DEFAULT_DUPLICATE_ORDER_WINDOW_MINUTES;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DUPLICATE_ORDER_WINDOW_MINUTES;
}

function normalizeProductIdSet(productIds: string[]): string[] {
  return Array.from(new Set(productIds.map((productId) => productId.trim()).filter(Boolean))).sort();
}

function ensureOrderStatus(value: string): OrderStatus {
  if (
    value === "new" ||
    value === "contacted" ||
    value === "confirmed" ||
    value === "closed" ||
    value === "cancelled" ||
    value === "duplicate" ||
    value === "invalid"
  ) {
    return value;
  }

  throw new Error(`Invalid order status: ${value}`);
}

export function normalizeOrderPayload(input: unknown): NormalizedOrderRequestPayload {
  if (!input || typeof input !== "object") {
    throw new OrderSubmissionError("Yêu cầu tạo đơn không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_ORDER_PAYLOAD",
    });
  }

  const payload = input as OrderRequestPayload;

  try {
    return {
      phone: normalizeVietnamPhone(payload.phone ?? ""),
      customerName: (payload.customerName ?? "").trim(),
      selectedProductIds: normalizeProductIdSet(parseNonEmptyStringArray(payload.selectedProductIds)),
      note: (payload.note ?? "").trim(),
      sourcePage: (payload.sourcePage ?? "cta").trim() || "cta",
      sourceCampaign: (payload.sourceCampaign ?? "").trim(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yêu cầu tạo đơn không hợp lệ.";
    throw new OrderSubmissionError(message, {
      statusCode: 400,
      code: "INVALID_ORDER_PAYLOAD",
    });
  }
}

type NormalizedExistingOrder = {
  createdAt: string;
  phone: string;
  selectedProductIds: string[];
  status: OrderStatus;
};

export function normalizeOrderRow(row: RawOrderRow): NormalizedExistingOrder {
  return {
    createdAt: row.created_at.trim(),
    phone: normalizeVietnamPhone(row.phone),
    selectedProductIds: normalizeProductIdSet(parseDelimitedList(row.selected_product_ids)),
    status: ensureOrderStatus(row.status.trim().toLowerCase()),
  };
}

export function isDuplicateOrderCandidate(
  candidate: { phone: string; selectedProductIds: string[]; createdAt: Date },
  existingOrders: Array<{ phone: string; selectedProductIds: string[]; createdAt: string; status: OrderStatus }>,
  duplicateWindowMinutes: number
): boolean {
  const candidateKey = normalizeProductIdSet(candidate.selectedProductIds).join("|");

  return existingOrders.some((order) => {
    if (order.status === "invalid") {
      return false;
    }

    const existingTime = new Date(order.createdAt);
    if (Number.isNaN(existingTime.getTime())) {
      return false;
    }

    const minutesDiff = Math.abs(candidate.createdAt.getTime() - existingTime.getTime()) / 60000;
    if (minutesDiff > duplicateWindowMinutes) {
      return false;
    }

    return (
      order.phone === candidate.phone &&
      normalizeProductIdSet(order.selectedProductIds).join("|") === candidateKey
    );
  });
}

function buildOrderId(now: Date): string {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

function buildOrderRow(snapshot: OrderRowSnapshot): string[] {
  return [
    snapshot.orderId,
    snapshot.createdAt,
    snapshot.phone,
    snapshot.customerName,
    snapshot.selectedProductIds.join("|"),
    snapshot.selectedProductNames.join("|"),
    String(snapshot.itemCount),
    snapshot.customerNote,
    snapshot.status,
    snapshot.adminNote,
    snapshot.sourcePage,
    snapshot.sourceCampaign,
    String(snapshot.duplicateFlag),
    snapshot.clientFingerprint,
    snapshot.processedAt,
  ];
}

function selectProductsForOrder(allProducts: Product[], selectedProductIds: string[]): Product[] {
  const selectedProducts = selectedProductIds
    .map((productId) => allProducts.find((product) => product.id === productId) ?? null)
    .filter((product): product is Product => product !== null);

  if (selectedProducts.length !== selectedProductIds.length) {
    throw new OrderSubmissionError("Một số sản phẩm đã chọn không còn tồn tại.", {
      statusCode: 400,
      code: "PRODUCTS_NOT_FOUND",
    });
  }

  const inactiveProduct = selectedProducts.find((product) => !isProductStatus(product.status) || product.status !== "active");
  if (inactiveProduct) {
    throw new OrderSubmissionError(`Sản phẩm "${inactiveProduct.name}" hiện không khả dụng.`, {
      statusCode: 400,
      code: "PRODUCT_INACTIVE",
    });
  }

  const outOfStockProduct = selectedProducts.find((product) => product.stockStatus === "out_of_stock");
  if (outOfStockProduct) {
    throw new OrderSubmissionError(`Sản phẩm "${outOfStockProduct.name}" hiện đang hết hàng.`, {
      statusCode: 400,
      code: "PRODUCT_OUT_OF_STOCK",
    });
  }

  return selectedProducts;
}

export async function submitQuickOrder(
  payload: unknown,
  overrides: Partial<OrderServiceDependencies> = {}
): Promise<OrderSubmissionResult> {
  const dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const normalizedPayload = normalizeOrderPayload(payload);
  const now = dependencies.now();
  const currentProducts = await dependencies.getProducts({ skipCache: true });
  const selectedProducts = selectProductsForOrder(currentProducts, normalizedPayload.selectedProductIds);
  const existingOrders = (await dependencies.readOrders()).map((row) => normalizeOrderRow(row));
  const duplicate = isDuplicateOrderCandidate(
    {
      phone: normalizedPayload.phone,
      selectedProductIds: normalizedPayload.selectedProductIds,
      createdAt: now,
    },
    existingOrders,
    getDuplicateWindowMinutes()
  );

  const snapshot: OrderRowSnapshot = {
    orderId: buildOrderId(now),
    createdAt: now.toISOString(),
    phone: normalizedPayload.phone,
    customerName: normalizedPayload.customerName,
    selectedProductIds: normalizedPayload.selectedProductIds,
    selectedProductNames: selectedProducts.map((product) => product.name),
    itemCount: selectedProducts.length,
    customerNote: normalizedPayload.note,
    status: duplicate ? "duplicate" : "new",
    adminNote: "",
    sourcePage: normalizedPayload.sourcePage,
    sourceCampaign: normalizedPayload.sourceCampaign,
    duplicateFlag: duplicate,
    clientFingerprint: "",
    processedAt: "",
  };

  await dependencies.appendRow(ORDERS_SHEET, buildOrderRow(snapshot));

  return {
    ok: true,
    orderId: snapshot.orderId,
    status: duplicate ? "duplicate" : "new",
    duplicate,
    normalizedPhone: snapshot.phone,
    itemCount: snapshot.itemCount,
    createdAt: snapshot.createdAt,
    message: duplicate
      ? "Yêu cầu của bạn đã được ghi nhận và đánh dấu là trùng gần đây."
      : "Yêu cầu của bạn đã được ghi nhận thành công.",
  };
}
