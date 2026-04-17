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
  status: string;
  stock_status: string;
  is_featured: string;
  display_order: string;
  search_keywords: string;
  created_at: string;
  updated_at: string;
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
  status: ProductStatus;
  stockStatus: ProductStockStatus;
  isFeatured: boolean;
  displayOrder: number;
  searchKeywords: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SelectedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  stockStatus: ProductStockStatus;
}

export interface ProductCatalogQuery {
  q?: string;
  category?: string;
  concern?: string;
  featured?: boolean;
  stockStatus?: ProductStockStatus;
}

export interface PublicSettings {
  brandPhone: string | null;
  zaloUrl: string | null;
  publicAnnouncement: string | null;
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
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
}

export interface NormalizedOrderRequestPayload {
  phone: string;
  customerName: string;
  selectedProductIds: string[];
  note: string;
  sourcePage: string;
  sourceCampaign: string;
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

export interface OrderSubmissionResult {
  ok: true;
  orderId: string;
  status: Extract<OrderStatus, "new" | "duplicate">;
  duplicate: boolean;
  normalizedPhone: string;
  itemCount: number;
  createdAt: string;
  message: string;
}

export interface OrderErrorResponse {
  error: string;
  code?: string;
}
