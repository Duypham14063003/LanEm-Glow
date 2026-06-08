export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { ConcernScroller } from "@/components/site/concern-scroller";
import { PageSection } from "@/components/site/page-section";
import { ProductDetailActions } from "@/components/site/product-detail-actions";
import { ProductGallery } from "@/components/site/product-gallery";
import { Card } from "@/components/ui/card";
import { buildProductMetadata } from "@/lib/metadata";
import { getCatalogProductBySlug } from "@/services/products";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return buildProductMetadata({
      name: "Sản phẩm không tồn tại",
      description: "LanEm Glow",
      slug,
    });
  }

  return buildProductMetadata({
    name: product.name,
    description: product.shortDescription,
    slug: product.slug,
    imageUrl: product.imageUrl,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <AnalyticsPageView
        event="product_viewed"
        payload={{
          productId: product.id,
          slug: product.slug,
          category: product.category,
        }}
      />
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <ProductGallery
            name={product.name}
            imageUrl={product.imageUrl}
            galleryUrls={product.galleryUrls}
            tiktokUrl={product.tiktokUrl}
            updatedAt={product.updatedAt}
          />

          <Card className="space-y-5 sm:space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="bg-[var(--color-primary-strong)] text-white text-xs font-bold px-3 py-1 rounded-sm tracking-wide w-fit">
                    {product.stockStatus === "out_of_stock"
                      ? "HẾT HÀNG"
                      : product.price > 300000
                        ? "HOT"
                        : "NEW"}
                  </div>
                  {product.searchKeywords?.[0]?.trim() ? (
                    <div className="bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-sm tracking-wide uppercase w-fit">
                      {product.searchKeywords[0].trim()}
                    </div>
                  ) : null}
                </div>
                {product.brand ? (
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {product.brand}
                  </p>
                ) : null}
                <h1 className="font-heading text-4xl text-[var(--color-foreground)] sm:text-5xl">
                  {product.name}
                </h1>
                <p className="text-base text-[var(--color-foreground-soft)]">
                  {product.shortDescription}
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-semibold text-[var(--color-accent)]">
                  {formatPrice(product.price)}đ
                </p>
                {product.compareAtPrice ? (
                  <p className="text-base text-[var(--color-muted)] line-through">
                    {formatPrice(product.compareAtPrice)}đ
                  </p>
                ) : null}
              </div>
              {product.quantity !== null && (
                <p className="text-sm font-medium text-[var(--color-foreground-soft)]">
                  Còn lại:{" "}
                  <span className="text-[var(--color-foreground)]">
                    {product.quantity}
                  </span>{" "}
                  sản phẩm
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--color-foreground-soft)]">
                Phù hợp với concern
              </p>
              <ConcernScroller concerns={product.concerns} />
            </div>

            <ProductDetailActions product={product} />
          </Card>
        </div>
      </PageSection>

      {/* <PageSection className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="space-y-4">
            <h2 className="font-heading text-4xl text-[var(--color-foreground)]">
              Mô tả
            </h2>
            <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
              {product.description}
            </p>
          </Card>
        </div>
      </PageSection> */}
    </>
  );
}
