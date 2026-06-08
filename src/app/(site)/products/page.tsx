import React from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { PageSection } from "@/components/site/page-section";
import { ProductCard } from "@/components/site/product-card";
import { ProductListFilters } from "@/components/site/product-list-filters";
import { StorefrontEmptyState } from "@/components/site/storefront-empty-state";
import { buildMetadata } from "@/lib/metadata";
import { listCatalogProducts, getCatalogProducts } from "@/services/products";
import type { Product, ProductCatalogQuery } from "@/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): ProductCatalogQuery {
  const q = getFirstValue(params.q)?.trim();
  const category = getFirstValue(params.category)?.trim();
  const brand = getFirstValue(params.brand)?.trim();
  const concern = getFirstValue(params.concern)?.trim();
  const featured = getFirstValue(params.featured)?.trim();
  const stockStatus = getFirstValue(params.stockStatus)?.trim();

  return {
    q: q || undefined,
    category: category || undefined,
    brand: brand || undefined,
    concern: concern || undefined,
    featured: featured === "true" ? true : undefined,
    stockStatus:
      stockStatus === "in_stock" ||
      stockStatus === "out_of_stock"
        ? stockStatus
        : undefined,
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Danh sách sản phẩm | LanEm Glow",
  description:
    "Duyệt catalog skincare của LanEm Glow, tìm theo concern, từ khóa và tình trạng tồn kho để shortlist routine phù hợp.",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const query = parseSearchParams(resolvedSearchParams);

  let items: Product[] = [];
  let concerns: string[] = [];
  let brands: string[] = [];

  try {
    const [filteredProducts, allProducts] = await Promise.all([
      listCatalogProducts(query),
      getCatalogProducts(),
    ]);

    items = filteredProducts;
    concerns = [...new Set(allProducts.flatMap((product) => product.concerns))];
    brands = [...new Set(allProducts.map((product) => product.brand).filter(Boolean))].sort((left, right) =>
      left.localeCompare(right)
    );
  } catch {
    items = [];
  }

  return (
    <>
      <AnalyticsPageView
        event={
          query.q || query.category || query.brand || query.concern || query.stockStatus
            ? "catalog_filtered"
            : "catalog_viewed"
        }
        payload={{
          q: query.q ?? null,
          category: query.category ?? null,
          brand: query.brand ?? null,
          concern: query.concern ?? null,
          stockStatus: query.stockStatus ?? null,
          featured: query.featured ?? null,
        }}
      />
      <PageSection className="pb-6 pt-8 sm:pt-12 text-center">
        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
          <p className="font-heading italic text-[var(--color-primary-strong)] text-lg">
            {query.featured ? "Best Seller" : "Tất cả sản phẩm"}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-[var(--color-foreground)] p-5 uppercase">
            {query.featured ? "SẢN PHẨM NỔI BẬT" : "TÌM SẢN PHẨM PHÙ HỢP"}
          </h1>
          <p className="text-base text-[var(--color-foreground-soft)] sm:text-lg leading-relaxed">
            {query.featured
              ? "Những món makeup và skincare được pass lại nhiều nhất với giá cực kỳ mềm."
              : "Tìm kiếm sản phẩm theo nhu cầu da và brand yêu thích của bạn. Cam kết chính hãng 100%."}
          </p>
        </div>
      </PageSection>

      <PageSection className="pt-0">
        <ProductListFilters
          query={query}
          brands={brands}
          concerns={concerns.map((concern) => concern.replaceAll("-", " "))}
        />
      </PageSection>

      <PageSection className="pt-0">
        {items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <StorefrontEmptyState
            title="Không có sản phẩm nào khớp bộ lọc hiện tại"
            description="Bạn có thể xóa bớt filter hoặc thử một concern khác để xem nhiều gợi ý phù hợp hơn."
          />
        )}
      </PageSection>
    </>
  );
}
