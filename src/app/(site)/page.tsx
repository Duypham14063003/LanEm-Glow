import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { AnalyticsPageView } from "@/components/analytics/analytics-page-view";
import { ConcernScroller } from "@/components/site/concern-scroller";
import { HeroCta } from "@/components/site/hero-cta";
import { PageSection } from "@/components/site/page-section";
import { ProductCard } from "@/components/site/product-card";
import { ProfileTrustSection } from "@/components/site/profile-trust-section";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { TrustStrip } from "@/components/site/trust-strip";
import { BrandStrip } from "@/components/site/brand-strip";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getCatalogProducts, listCatalogProducts } from "@/services/products";
import { getPublicSettings } from "@/services/settings";

const fallbackConcerns = [
  "da mun",
  "da kho",
  "phuc hoi",
  "lam sang",
  "chong nang",
];

const testimonials = [
  {
    quote:
      "Giá ổn, hàng giống mô tả với shop support siêu nhiệt tình 🥹 Mấy món cũng là đồ hot nhiều người dùng nên mua yên tâm hẳn.",
    author: "Khách hàng skincare tối giản",
  },
  {
    quote:
      "Web dễ nhìn cực, đọc thông tin nhanh với lựa đồ không bị rối 😭 Lướt chút là chốt được món hợp luôn.",
    author: "Khách hàng da nhạy cảm",
  },
  {
    quote:
      "Shop hay tặng quà kèm dễ thương ghê 🫶 Giá mềm mà sản phẩm xịn hơn mình nghĩ luôn á.",
    author: "Khách hàng mới bắt đầu skincare",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "LanEm Glow | Skincare tinh gọn, chọn nhanh theo nhu cầu da",
  description:
    "Khám phá skincare nhẹ nhàng, xem nhanh theo concern và shortlist sản phẩm phù hợp trước khi để lại số để được tư vấn.",
  path: "/",
});

async function getHomepageData() {
  try {
    const [settings, activeProducts, allProducts] = await Promise.all([
      getPublicSettings(),
      listCatalogProducts({}),
      getCatalogProducts(),
    ]);

    return {
      settings,
      featuredProducts: activeProducts.slice(0, 4),
      allProducts,
    };
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
    allProducts.flatMap((product) =>
      product.concerns.map((concern) => concern.toLowerCase()),
    ),
  );
  const concerns = [...concernSet].slice(0, 6);

  return (
    <>
      <AnalyticsPageView
        event="catalog_viewed"
        payload={{ source: "homepage" }}
      />
      <div className="animate-fade-in relative">
        <HeroCta
          primaryCtaLabel={settings.primaryCtaLabel}
          secondaryCtaLabel={settings.secondaryCtaLabel}
        />
        <div className="relative z-20 mx-auto w-full max-w-7xl -mt-6 sm:-mt-12 px-4 sm:px-8 pb-4">
          <TrustStrip />
        </div>
      </div>

      <PageSection
        className="py-4 pb-0 animate-slide-up overflow-hidden"
        style={{ animationDelay: "0.15s" }}
      >
        <BrandStrip />
      </PageSection>

      <PageSection
        className="py-6 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--color-foreground)]">
            DANH MỤC NỔI BẬT
          </h2>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium p-0 h-auto text-[var(--color-primary-strong)]"
          >
            <Link href="/categories">Xem tất cả &rarr;</Link>
          </Button>
        </div>
        <div>
          <ConcernScroller
            concerns={(concerns.length > 0 ? concerns : fallbackConcerns).map(
              (item) => item.replaceAll("-", " "),
            )}
          />
        </div>
      </PageSection>

      <PageSection
        className="py-6 animate-slide-up"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--color-foreground)]">
            SẢN PHẨM
          </h2>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium p-0 h-auto text-[var(--color-primary-strong)]"
          >
            <Link href="/products">Xem tất cả &rarr;</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actionLabel="View Details"
            />
          ))}
        </div>
      </PageSection>

      <PageSection
        className="py-8 animate-slide-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--color-foreground)]">
              FEEDBACK CỦA KHÁCH
            </h2>
            <Button
              asChild
              variant="ghost"
              className="text-sm font-medium p-0 h-auto text-[var(--color-primary-strong)]"
            >
              <Link href="/#feedback">Xem tất cả &rarr;</Link>
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.author} {...testimonial} />
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection
        className="mt-5 py-8 animate-slide-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--color-foreground)]">
              VIDEO THỰC TẾ
            </h2>
          </div>
          <div className="overflow-hidden pb-6 pt-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div className="flex gap-4 sm:gap-6 w-max animate-marquee">
              {[...[1, 2, 3, 4, 5, 6], ...[1, 2, 3, 4, 5, 6]].map(
                (num, idx) => (
                  <div
                    key={idx}
                    className="relative shrink-0 w-[75vw] sm:w-[280px] lg:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-sm border border-[var(--color-border)] bg-gray-50"
                  >
                    <video
                      src={`/videos/video${num}.mp4`}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        className="py-8 animate-slide-up"
        style={{ animationDelay: "0.8s" }}
      >
        <ProfileTrustSection />
      </PageSection>
    </>
  );
}
