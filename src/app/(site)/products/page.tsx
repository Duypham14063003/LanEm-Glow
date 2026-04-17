import React from "react";
import { PageSection } from "@/components/site/page-section";
import { ProductCard } from "@/components/site/product-card";
import { ProductListFilters } from "@/components/site/product-list-filters";
import { StorefrontEmptyState } from "@/components/site/storefront-empty-state";
import { Badge } from "@/components/ui/badge";
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
      <PageSection className="pb-4">
        <div className="space-y-4">
          <Badge variant="info">Catalog</Badge>
          <div className="space-y-3">
            <h1 className="font-heading text-5xl text-[var(--color-foreground)]">
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
