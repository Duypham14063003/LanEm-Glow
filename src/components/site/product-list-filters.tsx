"use client";

import Link from "next/link";

import { trackEvent } from "@/lib/analytics";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-5 rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-white/90 p-4 shadow-[var(--shadow-card)] sm:p-5">
      <form
        action="/products"
        className="grid gap-3 md:grid-cols-[1fr_220px_auto]"
        onSubmit={() => {
          trackEvent("catalog_filtered", {
            q: query.q ?? null,
            category: query.category ?? null,
            concern: query.concern ?? null,
            stockStatus: query.stockStatus ?? null,
          });
        }}
      >
        <Input
          name="q"
          defaultValue={query.q}
          placeholder="Tìm serum, chống nắng, phục hồi barrier..."
          aria-label="Tìm kiếm sản phẩm"
        />
        <select
          name="stockStatus"
          defaultValue={query.stockStatus ?? ""}
          aria-label="Lọc theo tình trạng tồn kho"
          className="h-12 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
        >
          <option value="">Tất cả tồn kho</option>
          <option value="in_stock">Sẵn hàng</option>
          <option value="preorder">Pre-order</option>
          <option value="out_of_stock">Tạm hết hàng</option>
        </select>
        <Button type="submit" className="w-full md:w-auto">
          Áp dụng
        </Button>
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
              onClick={() =>
                trackEvent("catalog_filtered", {
                  concern: query.concern === concern ? null : concern,
                  category: query.category ?? null,
                  q: query.q ?? null,
                })
              }
            >
              <Chip active={query.concern === concern}>{concern}</Chip>
            </Link>
          ))}
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
