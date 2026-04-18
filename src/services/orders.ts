import {
  appendSheetRow,
  assertRequiredHeaders,
  readSheetRows,
  readSheetRowsWithIndex,
  updateSheetRow,
} from "@/lib/sheets";
import {
  normalizeVietnamPhone,
  parseBoolean,
  parseDelimitedList,
  parseNonEmptyStringArray,
  parseRequiredNumber,
} from "@/lib/validation";
import { notifyAdminOfNewOrder } from "@/lib/notifications";
import { getCatalogProducts } from "@/services/products";
import type {
  NormalizedOrderRequestPayload,
  NotificationDeliveryResult,
  OrderAdminListItem,
  OrderAdminPatchPayload,
  OrderAdminQuery,
  OrderRequestPayload,
  OrderRowSnapshot,
  OrderStatus,
  OrderSubmissionResult,
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
  getProducts: typeof getCatalogProducts;
  readOrders: () => Promise<RawOrderRow[]>;
  readOrdersWithIndex: () => Promise<Array<{ rowNumber: number; row: RawOrderRow }>>;
  updateRow: (tabName: string, rowNumber: number, row: string[]) => Promise<void>;
  notifyOrderCreated: (
    order: OrderAdminListItem
  ) => Promise<NotificationDeliveryResult>;
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
  readOrdersWithIndex: async () => {
    const rows = await readSheetRowsWithIndex(ORDERS_SHEET);
    const normalizedRows = rows.map((row) => ({
      rowNumber: row.rowNumber,
      row: row.record as RawOrderRow,
    }));

    assertRequiredHeaders(
      normalizedRows.map((item) => item.row),
      [...ORDER_REQUIRED_HEADERS]
    );

    return normalizedRows;
  },
  updateRow: updateSheetRow,
  notifyOrderCreated: notifyAdminOfNewOrder,
  now: () => new Date(),
};

export class OrderServiceError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message);
    this.name = "OrderServiceError";
    this.statusCode = options?.statusCode ?? 400;
    this.code = options?.code ?? "ORDER_SUBMISSION_FAILED";
  }
}

export class OrderSubmissionError extends OrderServiceError {
  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message, options);
    this.name = "OrderSubmissionError";
  }
}

export class OrderAdminError extends OrderServiceError {
  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message, options);
    this.name = "OrderAdminError";
  }
}

export class OrderRateLimitError extends OrderServiceError {
  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message, options);
    this.name = "OrderRateLimitError";
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

export function normalizeProductIdSet(productIds: string[]): string[] {
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

function isValidOrderStatus(value: string): value is OrderStatus {
  try {
    ensureOrderStatus(value);
    return true;
  } catch {
    return false;
  }
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

export function normalizeOrderListItem(row: RawOrderRow): OrderAdminListItem {
  return {
    orderId: row.order_id.trim(),
    createdAt: row.created_at.trim(),
    phone: normalizeVietnamPhone(row.phone),
    customerName: row.customer_name.trim(),
    selectedProductIds: normalizeProductIdSet(parseDelimitedList(row.selected_product_ids)),
    selectedProductNames: parseDelimitedList(row.selected_product_names),
    itemCount: parseRequiredNumber(row.item_count, "item_count"),
    customerNote: row.customer_note.trim(),
    status: ensureOrderStatus(row.status.trim().toLowerCase()),
    adminNote: row.admin_note.trim(),
    sourcePage: row.source_page.trim(),
    sourceCampaign: row.source_campaign.trim(),
    duplicateFlag: parseBoolean(row.duplicate_flag),
    clientFingerprint: row.client_fingerprint.trim(),
    processedAt: row.processed_at.trim() || null,
  };
}

function sortOrderItems(items: OrderAdminListItem[]): OrderAdminListItem[] {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();
    return rightTime - leftTime;
  });
}

function matchesOrderQuery(order: OrderAdminListItem, query: OrderAdminQuery): boolean {
  if (query.status && order.status !== query.status) {
    return false;
  }

  if (typeof query.duplicate === "boolean" && order.duplicateFlag !== query.duplicate) {
    return false;
  }

  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    const haystacks = [order.orderId, order.phone, order.customerName].map((value) =>
      value.toLowerCase()
    );

    if (!haystacks.some((value) => value.includes(searchTerm))) {
      return false;
    }
  }

  if (query.dateFrom) {
    const dateFrom = new Date(query.dateFrom);
    const createdAt = new Date(order.createdAt);
    if (!Number.isNaN(dateFrom.getTime()) && createdAt < dateFrom) {
      return false;
    }
  }

  if (query.dateTo) {
    const dateTo = new Date(`${query.dateTo}T23:59:59.999Z`);
    const createdAt = new Date(order.createdAt);
    if (!Number.isNaN(dateTo.getTime()) && createdAt > dateTo) {
      return false;
    }
  }

  return true;
}

export function parseOrderAdminQuery(input: Record<string, string | undefined>): OrderAdminQuery {
  const status = input.status?.trim();
  const duplicate = input.duplicate?.trim();
  const dateFrom = input.dateFrom?.trim();
  const dateTo = input.dateTo?.trim();

  if (status && !isValidOrderStatus(status)) {
    throw new OrderAdminError("Trạng thái đơn hàng không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_ORDER_STATUS_FILTER",
    });
  }

  if (duplicate && !["true", "false"].includes(duplicate.toLowerCase())) {
    throw new OrderAdminError("Bộ lọc đơn trùng không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_DUPLICATE_FILTER",
    });
  }

  const normalizedDateFrom = dateFrom ? new Date(dateFrom) : null;
  const normalizedDateTo = dateTo ? new Date(dateTo) : null;

  if (dateFrom && Number.isNaN(normalizedDateFrom?.getTime())) {
    throw new OrderAdminError("Ngày bắt đầu không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_DATE_FROM",
    });
  }

  if (dateTo && Number.isNaN(normalizedDateTo?.getTime())) {
    throw new OrderAdminError("Ngày kết thúc không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_DATE_TO",
    });
  }

  return {
    q: input.q?.trim() || undefined,
    status: (status as OrderStatus | undefined) || undefined,
    duplicate: duplicate ? duplicate.toLowerCase() === "true" : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };
}

export function normalizeOrderPatchPayload(input: unknown): OrderAdminPatchPayload {
  if (!input || typeof input !== "object") {
    throw new OrderAdminError("Yêu cầu cập nhật đơn hàng không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_ORDER_PATCH_PAYLOAD",
    });
  }

  const payload = input as OrderAdminPatchPayload;
  const status = payload.status?.trim();
  const adminNote = typeof payload.adminNote === "string" ? payload.adminNote.trim() : undefined;

  if (!status && adminNote === undefined) {
    throw new OrderAdminError("Cần cung cấp ít nhất một trường để cập nhật.", {
      statusCode: 400,
      code: "EMPTY_ORDER_PATCH_PAYLOAD",
    });
  }

  if (status && !isValidOrderStatus(status)) {
    throw new OrderAdminError("Trạng thái cập nhật không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_ORDER_PATCH_STATUS",
    });
  }

  return {
    status: (status as OrderStatus | undefined) || undefined,
    adminNote,
  };
}

export async function listAdminOrders(
  query: OrderAdminQuery,
  overrides: Partial<OrderServiceDependencies> = {}
): Promise<OrderAdminListItem[]> {
  const dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const rows = await dependencies.readOrders();
  const items = rows.map((row) => normalizeOrderListItem(row));

  return sortOrderItems(items.filter((order) => matchesOrderQuery(order, query)));
}

export async function getAdminOrderById(
  orderId: string,
  overrides: Partial<OrderServiceDependencies> = {}
): Promise<OrderAdminListItem | null> {
  const dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const rows = await dependencies.readOrders();
  const row = rows.find((item) => item.order_id.trim() === orderId.trim());

  return row ? normalizeOrderListItem(row) : null;
}

function buildUpdatedRow(
  currentRow: RawOrderRow,
  payload: OrderAdminPatchPayload,
  now: Date
): string[] {
  const nextStatus = payload.status ?? ensureOrderStatus(currentRow.status.trim().toLowerCase());
  const nextProcessedAt =
    nextStatus !== "new" && !currentRow.processed_at.trim()
      ? now.toISOString()
      : currentRow.processed_at.trim();

  const snapshot: OrderRowSnapshot = {
    orderId: currentRow.order_id.trim(),
    createdAt: currentRow.created_at.trim(),
    phone: normalizeVietnamPhone(currentRow.phone),
    customerName: currentRow.customer_name.trim(),
    selectedProductIds: normalizeProductIdSet(parseDelimitedList(currentRow.selected_product_ids)),
    selectedProductNames: parseDelimitedList(currentRow.selected_product_names),
    itemCount: parseRequiredNumber(currentRow.item_count, "item_count"),
    customerNote: currentRow.customer_note.trim(),
    status: nextStatus,
    adminNote: payload.adminNote ?? currentRow.admin_note.trim(),
    sourcePage: currentRow.source_page.trim(),
    sourceCampaign: currentRow.source_campaign.trim(),
    duplicateFlag: parseBoolean(currentRow.duplicate_flag),
    clientFingerprint: currentRow.client_fingerprint.trim(),
    processedAt: nextProcessedAt,
  };

  return buildOrderRow(snapshot);
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

function selectProductsForOrder(
  allProducts: Awaited<ReturnType<typeof getCatalogProducts>>,
  selectedProductIds: string[]
) {
  const selectedProducts = selectedProductIds
    .map((productId) => allProducts.find((product) => product.id === productId) ?? null)
    .filter((product): product is NonNullable<(typeof allProducts)[number]> => product !== null);

  if (selectedProducts.length !== selectedProductIds.length) {
    throw new OrderSubmissionError("Một số sản phẩm đã chọn không còn tồn tại.", {
      statusCode: 400,
      code: "PRODUCTS_NOT_FOUND",
    });
  }

  const inactiveProduct = selectedProducts.find((product) => product.status !== "active");
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

export async function updateAdminOrder(
  orderId: string,
  payload: unknown,
  overrides: Partial<OrderServiceDependencies> = {}
): Promise<OrderAdminListItem> {
  const dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const normalizedPayload = normalizeOrderPatchPayload(payload);
  const rowEntry = (await dependencies.readOrdersWithIndex()).find(
    (item) => item.row.order_id.trim() === orderId.trim()
  );

  if (!rowEntry) {
    throw new OrderAdminError("Không tìm thấy đơn hàng cần cập nhật.", {
      statusCode: 404,
      code: "ORDER_NOT_FOUND",
    });
  }

  const updatedRow = buildUpdatedRow(rowEntry.row, normalizedPayload, dependencies.now());
  await dependencies.updateRow(ORDERS_SHEET, rowEntry.rowNumber, updatedRow);

  return normalizeOrderListItem({
    ...rowEntry.row,
    status: normalizedPayload.status ?? rowEntry.row.status,
    admin_note: normalizedPayload.adminNote ?? rowEntry.row.admin_note,
    processed_at:
      normalizedPayload.status &&
      normalizedPayload.status !== "new" &&
      !rowEntry.row.processed_at.trim()
        ? dependencies.now().toISOString()
        : rowEntry.row.processed_at,
  });
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
  const normalizedOrder = normalizeOrderListItem({
    order_id: snapshot.orderId,
    created_at: snapshot.createdAt,
    phone: snapshot.phone,
    customer_name: snapshot.customerName,
    selected_product_ids: snapshot.selectedProductIds.join("|"),
    selected_product_names: snapshot.selectedProductNames.join("|"),
    item_count: String(snapshot.itemCount),
    customer_note: snapshot.customerNote,
    status: snapshot.status,
    admin_note: snapshot.adminNote,
    source_page: snapshot.sourcePage,
    source_campaign: snapshot.sourceCampaign,
    duplicate_flag: String(snapshot.duplicateFlag),
    client_fingerprint: snapshot.clientFingerprint,
    processed_at: snapshot.processedAt,
  });
  const notification = await dependencies.notifyOrderCreated(normalizedOrder);

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
    notification,
    warning:
      notification.status === "failed"
        ? "Đơn hàng đã được ghi nhận nhưng email báo cho admin chưa gửi được."
        : undefined,
  };
}
