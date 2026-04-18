import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { ConcernScroller } from "@/components/site/concern-scroller";
import { PageSection } from "@/components/site/page-section";
import { ProductCard } from "@/components/site/product-card";
import { ProductDetailActions } from "@/components/site/product-detail-actions";
import { ProductGallery } from "@/components/site/product-gallery";
import { StorefrontCta } from "@/components/site/storefront-cta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buildProductMetadata } from "@/lib/metadata";
import { getCatalogProductBySlug, listCatalogProducts } from "@/services/products";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function getStockLabel(stockStatus: string) {
  switch (stockStatus) {
    case "in_stock":
      return { label: "Sẵn hàng", variant: "success" as const };
    case "preorder":
      return { label: "Pre-order", variant: "warning" as const };
    default:
      return { label: "Tạm hết hàng", variant: "error" as const };
  }
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

  const sameCategory = await listCatalogProducts({ category: product.category });
  const relatedProducts = sameCategory.filter((item) => item.slug !== product.slug).slice(0, 3);
  const stock = getStockLabel(product.stockStatus);

  return (
    <>
      <AnalyticsPageView
        event="product_viewed"
        payload={{ productId: product.id, slug: product.slug, category: product.category }}
      />
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <ProductGallery
            name={product.name}
            imageUrl={product.imageUrl}
            galleryUrls={product.galleryUrls}
          />

          <Card className="space-y-5 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={stock.variant}>{stock.label}</Badge>
                {product.isFeatured ? <Badge variant="info">Nổi bật</Badge> : null}
              </div>
              <div className="space-y-3">
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

      <PageSection className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="space-y-4">
            <h2 className="font-heading text-4xl text-[var(--color-foreground)]">Mô tả</h2>
            <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
              {product.description}
            </p>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-heading text-4xl text-[var(--color-foreground)]">
              Hướng dẫn chọn nhanh
            </h2>
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-foreground-soft)]">
              <li>Ưu tiên 1-2 món thực sự hợp concern trước khi mở rộng routine.</li>
              <li>Texture nhẹ, dễ layer thường phù hợp cho người mới bắt đầu.</li>
              <li>Nếu da đang nhạy cảm, hãy bắt đầu từ phục hồi và chống nắng hằng ngày.</li>
            </ul>
          </Card>
        </div>
      </PageSection>

      {relatedProducts.length > 0 ? (
        <PageSection className="pt-0">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Liên quan
              </p>
              <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
                Có thể bạn cũng sẽ thích
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </PageSection>
      ) : null}

      <PageSection className="pt-0">
        <StorefrontCta
          title="Muốn xem thêm sản phẩm cùng vibe nhẹ và dễ dùng?"
          description="Bạn có thể quay lại catalog để xem thêm các món nổi bật, serum phục hồi hoặc chống nắng phù hợp cho routine hằng ngày."
        />
      </PageSection>
    </>
  );
}
