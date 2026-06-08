"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { useQuickOrder } from "@/hooks/use-quick-order";
import { useSelectedProducts } from "@/hooks/use-selected-products";
import { appendVersionToUrl } from "@/lib/utils";
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
  href = `/products/${product.slug}`,
}: ProductCardProps) {
  const { openQuickOrder } = useQuickOrder();
  const { addProduct } = useSelectedProducts();

  const conditionTag = product.searchKeywords?.[0]?.trim();
  const imageSrc = appendVersionToUrl(product.imageUrl, product.updatedAt);

  return (
    <div className="group relative bg-white rounded-3xl p-4 shadow-sm border border-[var(--color-border)] transition-all hover:shadow-md flex flex-col h-full">
      {/* Top Badges & Icons */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
        <div className="flex gap-2">
          {/* <div className="bg-[var(--color-primary-strong)] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wide">
              {badgeText}
           </div> */}
          {conditionTag ? (
            <div className="bg-[var(--color-accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wide uppercase">
              {conditionTag}
            </div>
          ) : null}
        </div>
        <button className="pointer-events-auto text-gray-300 hover:text-[var(--color-primary-strong)] transition-colors">
          <Heart className="size-5" />
        </button>
      </div>

      {/* Image */}
      <Link
        href={href}
        className="relative aspect-square w-full mb-4 mt-2 overflow-hidden flex items-center justify-center"
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-xl" />
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 justify-between">
        <Link href={href}>
          {product.brand ? (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              {product.brand}
            </p>
          ) : null}
          <h3 className="font-heading text-sm font-medium text-[var(--color-foreground)] line-clamp-2 leading-tight group-hover:text-[var(--color-primary-strong)] transition-colors mb-4">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="font-bold text-[var(--color-danger)] text-lg leading-none">
              {formatPrice(product.price)}đ
            </span>
            <div className="flex items-center gap-2 mt-1">
              {product.compareAtPrice !== null ? (
                <span className="text-xs text-[var(--color-muted)] line-through">
                  {formatPrice(product.compareAtPrice)}đ
                </span>
              ) : null}
              {product.quantity !== null && (
                <span className="text-xs font-medium text-[var(--color-foreground-soft)]">
                  Kho: {product.quantity}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                addProduct(product);
              }}
              className="h-9 w-9 rounded-full border border-[var(--color-primary-strong)] text-[var(--color-primary-strong)] flex items-center justify-center hover:bg-[var(--color-primary-strong)] hover:text-white transition-colors shadow-sm"
              title="Thêm vào giỏ"
            >
              <ShoppingCart className="size-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                addProduct(product);
                openQuickOrder("card");
              }}
              className="h-9 px-4 rounded-full bg-[var(--color-primary-strong)] text-white text-xs font-bold flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors shadow-sm whitespace-nowrap"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
