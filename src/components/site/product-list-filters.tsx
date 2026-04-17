import Link from "next/link";

import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import type { ProductCatalogQuery } from "@/types";

interface ProductListFiltersProps {
  query: ProductCatalogQuery;
  categories: string[];
  concerns: string[];
}

function buildFilterHref(
  query: ProductCatalogQuery,
  updates: Partial<ProductCatalogQuery>
): string {
  const nextQuery: ProductCatalogQuery = { ...query, ...updates };
  const params = new URLSearchParams();

  if (nextQuery.q) params.set("q", nextQuery.q);
  if (nextQuery.category) params.set("category", nextQuery.category);
  if (nextQuery.concern) params.set("concern", nextQuery.concern);
  if (typeof nextQuery.featured === "boolean") {
    params.set("featured", String(nextQuery.featured));
  }
  if (nextQuery.stockStatus) params.set("stockStatus", nextQuery.stockStatus);

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : "/products";
}

export function ProductListFilters({
  query,
  categories,
  concerns,
}: ProductListFiltersProps) {
  const hasFilters = Boolean(
    query.q || query.category || query.concern || query.stockStatus || query.featured
  );

  return (
    <div className="space-y-5 rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-white/90 p-5 shadow-[var(--shadow-card)]">
      <form action="/products" className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          name="q"
          defaultValue={query.q}
          placeholder="Tìm serum, chống nắng, phục hồi barrier..."
          aria-label="Tìm kiếm sản phẩm"
        />
        <div className="flex gap-3">
          <Input
            name="stockStatus"
            defaultValue={query.stockStatus}
            placeholder="in_stock / preorder"
            aria-label="Lọc theo tình trạng tồn kho"
          />
        </div>
      </form>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-foreground-soft)]">Concern nổi bật</p>
        <div className="flex flex-wrap gap-2">
          {concerns.map((concern) => (
            <Link
              key={concern}
              href={buildFilterHref(query, {
                concern: query.concern === concern ? undefined : concern,
              })}
            >
              <Chip active={query.concern === concern}>{concern}</Chip>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-foreground-soft)]">Danh mục</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={buildFilterHref(query, {
                category: query.category === category ? undefined : category,
              })}
            >
              <Chip active={query.category === category}>{category}</Chip>
            </Link>
          ))}
          <Link href={buildFilterHref(query, { featured: query.featured ? undefined : true })}>
            <Chip active={query.featured === true}>Nổi bật</Chip>
          </Link>
        </div>
      </div>

      {hasFilters ? (
        <div className="pt-1">
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--color-accent)] transition hover:opacity-80"
          >
            Xóa bộ lọc
          </Link>
        </div>
      ) : null}
    </div>
  );
}
