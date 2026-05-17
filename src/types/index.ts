export type ProductStatus = "active" | "inactive";
export type ProductStockStatus = "in_stock" | "out_of_stock" | "preorder";

export type RawSheetRow = Record<string, string>;

export interface RawProductRow extends RawSheetRow {
  product_id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  category: string;
  skin_concern: string;
  price: string;
  compare_at_price: string;
  image_url: string;
  gallery_urls: string;
  tiktok_url: string;
  status: string;
  stock_status: string;
  is_featured: string;
  display_order: string;
  search_keywords: string;
  created_at: string;
  updated_at: string;
  quantity?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  concerns: string[];
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  galleryUrls: string[];
  tiktokUrl: string | null;
  status: ProductStatus;
  stockStatus: ProductStockStatus;
  isFeatured: boolean;
  displayOrder: number;
  searchKeywords: string[];
  createdAt: string | null;
  updatedAt: string | null;
  quantity: number | null;
}

export interface SelectedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  stockStatus: ProductStockStatus;
  orderQuantity?: number;
}

export interface ProductCatalogQuery {
  q?: string;
  category?: string;
  concern?: string;
  featured?: boolean;
  stockStatus?: ProductStockStatus;
}

export interface ProductAdminQuery {
  q?: string;
  status?: ProductStatus;
}

export interface ProductAdminListItem extends Product {
  rowNumber: number;
}

export interface ProductAdminMutationInput {
  productId: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  concerns: string[];
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  galleryUrls: string[];
  tiktokUrl: string | null;
  status: ProductStatus;
  stockStatus: ProductStockStatus;
  isFeatured: boolean;
  displayOrder: number;
  searchKeywords: string[];
  quantity: number | null;
}

export interface ProductAdminListResponse {
  items: ProductAdminListItem[];
  total: number;
  query: ProductAdminQuery;
}

export interface ProductAdminMutationResponse {
  product: ProductAdminListItem;
}

export interface ProductAdminArchiveResponse {
  product: ProductAdminListItem;
}

export interface PublicSettings {
  brandPhone: string | null;
  zaloUrl: string | null;
  publicAnnouncement: string | null;
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
}

export interface AdminSettingsMutationInput {
  brandPhone?: string;
  zaloUrl?: string;
  publicAnnouncement?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
}

export interface AdminSettingsResponse {
  settings: PublicSettings;
}

export interface CatalogListResponse {
  items: Product[];
  total: number;
  query: ProductCatalogQuery;
}

export interface ProductDetailResponse {
  product: Product;
}

export interface PublicSettingsResponse {
  settings: PublicSettings;
}

export interface QuickOrderFormValues {
  phone: string;
  name: string;
  note: string;
}

export type OrderStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "closed"
  | "cancelled"
  | "duplicate"
  | "invalid";

export interface OrderRequestPayload {
  phone: string;
  customerName?: string;
  selectedProductIds: string[];
  note?: string;
  sourcePage?: string;
  sourceCampaign?: string;
  quantities?: Record<string, number>;
}

export interface NormalizedOrderRequestPayload {
  phone: string;
  customerName: string;
  selectedProductIds: string[];
  note: string;
  sourcePage: string;
  sourceCampaign: string;
  quantities: Record<string, number>;
}

export interface OrderRowSnapshot {
  orderId: string;
  createdAt: string;
  phone: string;
  customerName: string;
  selectedProductIds: string[];
  selectedProductNames: string[];
  itemCount: number;
  customerNote: string;
  status: OrderStatus;
  adminNote: string;
  sourcePage: string;
  sourceCampaign: string;
  duplicateFlag: boolean;
  clientFingerprint: string;
  processedAt: string;
}

export interface RawOrderRow extends RawSheetRow {
  order_id: string;
  created_at: string;
  phone: string;
  customer_name: string;
  selected_product_ids: string;
  selected_product_names: string;
  item_count: string;
  customer_note: string;
  status: string;
  admin_note: string;
  source_page: string;
  source_campaign: string;
  duplicate_flag: string;
  client_fingerprint: string;
  processed_at: string;
}

export interface OrderAdminListItem {
  orderId: string;
  createdAt: string;
  phone: string;
  customerName: string;
  selectedProductIds: string[];
  selectedProductNames: string[];
  itemCount: number;
  customerNote: string;
  status: OrderStatus;
  adminNote: string;
  sourcePage: string;
  sourceCampaign: string;
  duplicateFlag: boolean;
  clientFingerprint: string;
  processedAt: string | null;
}

export interface OrderAdminQuery {
  q?: string;
  status?: OrderStatus;
  duplicate?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderAdminPatchPayload {
  status?: OrderStatus;
  adminNote?: string;
}

export interface OrderAdminCreateInput {
  phone: string;
  customerName?: string;
  selectedProductIds: string[];
  note?: string;
  sourcePage?: string;
  sourceCampaign?: string;
  quantities?: Record<string, number>;
}

export interface OrderAdminListResponse {
  items: OrderAdminListItem[];
  total: number;
  query: OrderAdminQuery;
}

export interface OrderAdminUpdateResponse {
  order: OrderAdminListItem;
}

export interface OrderAdminCreateResponse {
  order: OrderAdminListItem;
}

export type NotificationDeliveryStatus = "sent" | "skipped" | "failed";

export interface NotificationDeliveryResult {
  status: NotificationDeliveryStatus;
  code:
    | "NOTIFICATION_SENT"
    | "NOTIFICATION_DISABLED"
    | "NOTIFICATION_CONFIG_MISSING"
    | "NOTIFICATION_DELIVERY_FAILED";
  message: string;
}

export interface OrderSubmissionResult {
  ok: true;
  orderId: string;
  status: Extract<OrderStatus, "new" | "duplicate">;
  duplicate: boolean;
  normalizedPhone: string;
  itemCount: number;
  createdAt: string;
  message: string;
  notification: NotificationDeliveryResult;
  warning?: string;
}

export interface OrderErrorResponse {
  error: string;
  code?: string;
}
