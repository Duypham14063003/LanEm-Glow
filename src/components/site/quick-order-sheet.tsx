"use client";

import { useMemo, useState } from "react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuickOrder, validateQuickOrderForm } from "@/hooks/use-quick-order";
import { useSelectedProducts } from "@/hooks/use-selected-products";
import type { QuickOrderFormValues } from "@/types";

const initialValues: QuickOrderFormValues = {
  phone: "",
  name: "",
  note: "",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function QuickOrderSheet() {
  const { isOpen, closeQuickOrder } = useQuickOrder();
  const { items, removeProduct, clearProducts } = useSelectedProducts();
  const [values, setValues] = useState<QuickOrderFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => validateQuickOrderForm(values, items), [items, values]);

  const handleClose = () => {
    closeQuickOrder();
    setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateQuickOrderForm(values, items);
    if (!result.isValid) {
      return;
    }

    setSubmitted(true);
    clearProducts();
    setValues(initialValues);
  };

  return (
    <BottomSheet open={isOpen} onOpenChange={(open) => (open ? undefined : handleClose())} title="Quick order">
      {submitted ? (
        <div className="space-y-4">
          <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">
            Cảm ơn bạn đã để lại thông tin. LanEm Glow sẽ liên hệ sớm để xác nhận lựa chọn và
            tư vấn thêm nếu cần. Bạn chưa cần thanh toán online trước.
          </p>
          <Button onClick={handleClose}>Đóng</Button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                Sản phẩm đã chọn
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                {items.length} món
              </p>
            </div>
            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-3"
                  >
                    <div className="size-14 overflow-hidden rounded-[14px] bg-white">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-accent)]">
                        {formatPrice(item.price)}đ
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(item.id)}
                      className="text-sm font-medium text-[var(--color-accent)] transition hover:opacity-80"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--color-danger)]">
                  {validation.errors.selectedProducts}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]" htmlFor="phone">
                Số điện thoại
              </label>
              <Input
                id="phone"
                value={values.phone}
                hasError={Boolean(validation.errors.phone)}
                onChange={(event) =>
                  setValues((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="0912345678"
              />
              {validation.errors.phone ? (
                <p className="text-sm text-[var(--color-danger)]">{validation.errors.phone}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]" htmlFor="name">
                Tên của bạn
              </label>
              <Input
                id="name"
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Tên tuỳ chọn"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]" htmlFor="note">
                Ghi chú
              </label>
              <Textarea
                id="note"
                value={values.note}
                onChange={(event) =>
                  setValues((current) => ({ ...current, note: event.target.value }))
                }
                placeholder="Ví dụ: da nhạy cảm, muốn routine phục hồi nhẹ..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={!validation.isValid}>
              Gửi yêu cầu
            </Button>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Đóng
            </Button>
          </div>
        </form>
      )}
    </BottomSheet>
  );
}
