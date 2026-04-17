import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "@/types";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

interface ProductCardProps {
  product: Product;
  actionLabel?: string;
  href?: string;
}

export function ProductCard({
  product,
  actionLabel = "Xem chi tiết",
  href = `/products/${product.slug}`,
}: ProductCardProps) {
  const isOutOfStock = product.stockStatus === "out_of_stock";

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <Link href={href} className="block">
        <div className="aspect-[4/3] bg-[linear-gradient(135deg,#fff,#fbe4ea)]">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Link href={href}>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-[var(--color-foreground-soft)]">
              {product.shortDescription}
            </p>
          </div>
          {product.isFeatured ? <Badge variant="info">Nổi bật</Badge> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.concerns.slice(0, 2).map((concern) => (
            <Badge key={concern} variant="neutral">
              {concern}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Giá bán</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xl font-semibold text-[var(--color-accent)]">
                {formatPrice(product.price)}đ
              </p>
              {product.compareAtPrice ? (
                <p className="text-sm text-[var(--color-muted)] line-through">
                  {formatPrice(product.compareAtPrice)}đ
                </p>
              ) : null}
            </div>
          </div>

          {isOutOfStock ? (
            <Button disabled variant="secondary">
              Tạm hết hàng
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href={href}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
