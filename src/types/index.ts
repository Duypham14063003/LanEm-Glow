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
