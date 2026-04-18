import React from "react";
import type { Metadata } from "next";

import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { PageSection } from "@/components/site/page-section";
import { ProductCard } from "@/components/site/product-card";
import { ProductListFilters } from "@/components/site/product-list-filters";
import { StorefrontEmptyState } from "@/components/site/storefront-empty-state";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/metadata";
import { listCatalogProducts, getCatalogProducts } from "@/services/products";
import type { Product, ProductCatalogQuery } from "@/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSearchParams(params: Record<string, string | string[] | undefined>): ProductCatalogQuery {
  const q = getFirstValue(params.q)?.trim();
  const category = getFirstValue(params.category)?.trim();
  const concern = getFirstValue(params.concern)?.trim();
  const featured = getFirstValue(params.featured)?.trim();
  const stockStatus = getFirstValue(params.stockStatus)?.trim();

  return {
    q: q || undefined,
    category: category || undefined,
    concern: concern || undefined,
    featured: featured === "true" ? true : undefined,
    stockStatus:
      stockStatus === "in_stock" || stockStatus === "out_of_stock" || stockStatus === "preorder"
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
  let categories: string[] = [];
  let concerns: string[] = [];

  try {
    const [filteredProducts, allProducts] = await Promise.all([
      listCatalogProducts(query),
      getCatalogProducts(),
    ]);

    items = filteredProducts;
    categories = [...new Set(allProducts.map((product) => product.category.toLowerCase()))];
    concerns = [...new Set(allProducts.flatMap((product) => product.concerns))];
  } catch {
    items = [];
  }

  return (
    <>
      <AnalyticsPageView
        event={query.q || query.category || query.concern || query.stockStatus ? "catalog_filtered" : "catalog_viewed"}
        payload={{
          q: query.q ?? null,
          category: query.category ?? null,
          concern: query.concern ?? null,
          stockStatus: query.stockStatus ?? null,
          featured: query.featured ?? null,
        }}
      />
      <PageSection className="pb-4">
        <div className="space-y-4">
          <Badge variant="info">Catalog</Badge>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl text-[var(--color-foreground)] sm:text-5xl">
              Tìm sản phẩm theo nhu cầu da và texture bạn thích.
            </h1>
            <p className="max-w-3xl text-base text-[var(--color-foreground-soft)] sm:text-lg">
              Listing này ưu tiên trải nghiệm xem nhanh trên mobile: lọc theo concern, tìm
              theo từ khóa, và rút ngắn thời gian chọn món phù hợp.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection className="pt-0">
        <ProductListFilters
          query={query}
          categories={categories}
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
