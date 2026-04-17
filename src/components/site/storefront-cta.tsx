import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StorefrontCtaProps {
  title: string;
  description: string;
  primaryLabel?: string | null;
  secondaryLabel?: string | null;
}

export function StorefrontCta({
  title,
  description,
  primaryLabel,
  secondaryLabel,
}: StorefrontCtaProps) {
  return (
    <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(251,228,234,0.96),rgba(255,248,249,0.98))] p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-heading text-4xl text-[var(--color-foreground)]">{title}</h2>
          <p className="text-sm text-[var(--color-foreground-soft)] sm:text-base">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/products">{primaryLabel ?? "Xem sản phẩm"}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products?featured=true">{secondaryLabel ?? "Xem sản phẩm nổi bật"}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
