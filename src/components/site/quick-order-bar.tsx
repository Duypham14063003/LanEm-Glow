"use client";

import { Button } from "@/components/ui/button";
import { useQuickOrder } from "@/hooks/use-quick-order";
import { useSelectedProducts } from "@/hooks/use-selected-products";

export function QuickOrderBar() {
  const { count } = useSelectedProducts();
  const { openQuickOrder } = useQuickOrder();

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4 md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-full border border-[var(--color-border)] bg-white/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-lg">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)]">
            Đã chọn {count} sản phẩm
          </p>
          <p className="text-xs text-[var(--color-foreground-soft)]">
            Mở quick order để để lại số và ghi chú nhẹ
          </p>
        </div>
        <Button size="sm" onClick={() => openQuickOrder("bar")}>
          Để lại số
        </Button>
      </div>
    </div>
  );
}
