import Image from "next/image";
import Link from "next/link";

import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SiteHeaderProps {
  phone: string | null;
  primaryCtaLabel: string | null;
}

export function SiteHeader({ phone, primaryCtaLabel }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[color:color-mix(in_srgb,white_82%,var(--color-page))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-fit">
            <div className="flex items-center gap-3 rounded-full pr-2 transition hover:opacity-95">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[var(--color-border)] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-4 ring-white/60">
                <Image
                  src={logoImage}
                  alt="LanEm Glow"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-3xl leading-none text-[var(--color-foreground)]">
                  LanEm Glow
                </span>
                <span className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Skincare storefront
                </span>
              </div>
            </div>
          </Link>

          <div className="lg:hidden">
            <Button asChild size="sm">
              <Link href="/products">{primaryCtaLabel ?? "Xem sản phẩm"}</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
          <form action="/products" className="w-full lg:max-w-sm">
            <Input
              name="q"
              aria-label="Tìm kiếm sản phẩm"
              placeholder="Tìm serum, chống nắng, phục hồi..."
            />
          </form>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Button asChild>
                <Link href="/products">
                  {primaryCtaLabel ?? "Xem sản phẩm"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
