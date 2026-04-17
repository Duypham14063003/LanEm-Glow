import React from "react";
import Link from "next/link";

import { ConcernScroller } from "@/components/site/concern-scroller";
import { HeroCta } from "@/components/site/hero-cta";
import { PageSection } from "@/components/site/page-section";
import { ProductCard } from "@/components/site/product-card";
import { StorefrontCta } from "@/components/site/storefront-cta";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { TrustStrip } from "@/components/site/trust-strip";
import { Button } from "@/components/ui/button";
import { getCatalogProducts, listCatalogProducts } from "@/services/products";
import { getPublicSettings } from "@/services/settings";

const fallbackConcerns = ["da mun", "da kho", "phuc hoi", "lam sang", "chong nang"];

const testimonials = [
  {
    quote:
      "Mình thích cảm giác được gợi ý vừa đủ, không bị ép mua nhiều bước. Xem xong là biết nên bắt đầu từ đâu.",
    author: "Khách hàng skincare tối giản",
    context: "Routine phục hồi sau treatment",
  },
  {
    quote:
      "Cách trình bày rất nhẹ mắt, nhìn nhanh trên điện thoại vẫn chọn được sản phẩm phù hợp.",
    author: "Khách hàng da nhạy cảm",
    context: "Tìm kem chống nắng dùng hằng ngày",
  },
  {
    quote:
      "Phần mô tả ngắn gọn nhưng đủ tin cậy, nên mình dễ shortlist vài món rồi quyết định sau.",
    author: "Khách hàng mới bắt đầu skincare",
    context: "Chọn serum đầu tiên",
  },
];

async function getHomepageData() {
  try {
    const [settings, featuredProducts, allProducts] = await Promise.all([
      getPublicSettings(),
      listCatalogProducts({ featured: true }),
      getCatalogProducts(),
    ]);

    return { settings, featuredProducts: featuredProducts.slice(0, 6), allProducts };
  } catch {
    return {
      settings: {
        brandPhone: null,
        zaloUrl: null,
        publicAnnouncement: null,
        primaryCtaLabel: "Xem sản phẩm",
        secondaryCtaLabel: "Nhận tư vấn",
      },
      featuredProducts: [],
      allProducts: [],
    };
  }
}

export default async function SiteHomePage() {
  const { settings, featuredProducts, allProducts } = await getHomepageData();
  const concernSet = new Set(
    allProducts.flatMap((product) => product.concerns.map((concern) => concern.toLowerCase()))
  );
  const concerns = [...concernSet].slice(0, 6);

  return (
    <>
      <PageSection className="pb-6 sm:pb-8">
        <HeroCta
          primaryCtaLabel={settings.primaryCtaLabel}
          secondaryCtaLabel={settings.secondaryCtaLabel}
        />
      </PageSection>

      <PageSection className="py-6 sm:py-8">
        <TrustStrip />
      </PageSection>

      <PageSection>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Chọn nhanh theo nhu cầu
            </p>
            <h2 className="font-heading text-4xl text-[var(--color-foreground)]">
              Bắt đầu từ concern của làn da
            </h2>
          </div>
        </div>
        <div className="mt-6">
          <ConcernScroller
            concerns={(concerns.length > 0 ? concerns : fallbackConcerns).map((item) =>
              item.replaceAll("-", " ")
            )}
          />
        </div>
      </PageSection>

      <PageSection>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Sản phẩm nổi bật
            </p>
            <h2 className="font-heading text-4xl text-[var(--color-foreground)]">
              Những món skincare được tìm nhiều nhất
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/products?featured=true">Xem tất cả</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} actionLabel="Xem sản phẩm" />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <StorefrontCta
          title="Khám phá routine phù hợp với da bạn, từng bước một."
          description="Từ serum phục hồi đến chống nắng hằng ngày, storefront này được dựng để bạn xem nhanh, hiểu nhanh và quyết định với cảm giác nhẹ nhàng hơn."
          primaryLabel={settings.primaryCtaLabel}
          secondaryLabel={settings.secondaryCtaLabel}
        />
      </PageSection>
    </>
  );
}
