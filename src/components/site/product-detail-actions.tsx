"use client";

import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { useQuickOrder } from "@/hooks/use-quick-order";
import { useSelectedProducts } from "@/hooks/use-selected-products";
import type { Product } from "@/types";

export function ProductDetailActions({ product }: { product: Product }) {
  const { toggleProduct, isSelected } = useSelectedProducts();
  const { openQuickOrder } = useQuickOrder();
  const selected = isSelected(product.id);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={selected ? "primary" : "secondary"}
        disabled={isOutOfStock}
        onClick={() => {
          toggleProduct(product);
          trackEvent("product_selected", {
            productId: product.id,
            slug: product.slug,
            selected: !selected,
            source: "product_detail",
          });
        }}
      >
        {isOutOfStock ? "Tạm hết hàng" : selected ? "Đã chọn" : "Chọn sản phẩm"}
      </Button>
      <Button
        onClick={() => {
          trackEvent("quick_order_opened", {
            source: "detail",
            productId: product.id,
          });
          openQuickOrder("detail");
        }}
      >
        Để lại số để được tư vấn
      </Button>
    </div>
  );
}
