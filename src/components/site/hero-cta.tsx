import Link from "next/link";

import { ArrowRight, Droplets, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroCtaProps {
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
}

export function HeroCta({ primaryCtaLabel, secondaryCtaLabel }: HeroCtaProps) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(251,228,234,0.88),rgba(255,248,249,1))] shadow-[var(--shadow-card)]">
      <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[var(--color-accent)] shadow-[var(--shadow-soft)]">
            <Sparkles className="size-4" aria-hidden="true" />
            Chọn skincare nhẹ nhàng, đáng tin và dễ bắt đầu
          </div>
          <div className="space-y-4">
            <h1 className="font-heading text-5xl leading-[1.02] tracking-[-0.03em] text-[var(--color-foreground)] sm:text-6xl">
              Làn da cần được lắng nghe trước khi cần thật nhiều bước.
            </h1>
            <p className="max-w-2xl text-base text-[var(--color-foreground-soft)] sm:text-lg">
              LanEm Glow giúp bạn tìm sản phẩm theo nhu cầu da, xem nhanh những món nổi bật
              và bắt đầu routine với cảm giác nhẹ, rõ và không bị quá tải.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/products">
                {primaryCtaLabel ?? "Xem sản phẩm"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/products?featured=true">
                {secondaryCtaLabel ?? "Để lại số để được tư vấn"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[calc(var(--radius-sheet)-4px)] bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(247,204,214,0.85),rgba(239,167,182,0.25))] p-6">
          <div className="absolute -right-10 top-10 h-28 w-28 rounded-full bg-white/60 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-[var(--color-accent-soft)]/80 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-white/60 bg-white/70 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-[var(--color-accent-soft)] p-3 text-[var(--color-accent)]">
                <Droplets className="size-5" aria-hidden="true" />
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Beauty editorial
              </span>
            </div>
            <div className="space-y-3">
              <p className="font-heading text-3xl text-[var(--color-foreground)]">
                Glow dịu, không phô trương.
              </p>
              <p className="text-sm text-[var(--color-foreground-soft)]">
                Ưu tiên những texture dễ layer, cảm giác tin cậy và routine đủ dùng mỗi ngày.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-[var(--radius-card)] bg-white px-3 py-4">
                <p className="font-semibold text-[var(--color-foreground)]">4.8/5</p>
                <p className="mt-1 text-[var(--color-muted)]">review nhanh</p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-white px-3 py-4">
                <p className="font-semibold text-[var(--color-foreground)]">12h</p>
                <p className="mt-1 text-[var(--color-muted)]">phản hồi</p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-white px-3 py-4">
                <p className="font-semibold text-[var(--color-foreground)]">100%</p>
                <p className="mt-1 text-[var(--color-muted)]">mềm mại</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
