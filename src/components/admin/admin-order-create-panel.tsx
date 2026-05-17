"use client";

import { useState } from "react";

import type { Product } from "@/types";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AdminOrderCreatePanel({ products }: { products: Product[] }) {
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [sourceCampaign, setSourceCampaign] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId]
    );
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          phone,
          customerName,
          selectedProductIds,
          note,
          sourcePage: "admin_manual",
          sourceCampaign,
        }),
      });

      const payload = (await response.json()) as
        | { order: { orderId: string } }
        | { error?: string };

      if (!response.ok) {
        setError(
          "error" in payload ? payload.error ?? "Không thể tạo đơn hàng thủ công." : "Không thể tạo đơn hàng thủ công."
        );
        return;
      }

      const orderId = (payload as { order: { orderId: string } }).order.orderId;
      setMessage("Đã tạo đơn hàng mới. Đang chuyển sang chi tiết đơn...");
      window.location.href = `/admin/orders?selectedOrderId=${encodeURIComponent(orderId)}`;
    } catch {
      setError("Không thể kết nối để tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="space-y-5 p-4 sm:p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">Tạo đơn thủ công</p>
        <h2 className="mt-1 text-3xl text-[var(--color-foreground)]">Đơn hàng mới</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Số điện thoại">
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} disabled={isSaving} />
        </Field>
        <Field label="Tên khách">
          <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} disabled={isSaving} />
        </Field>
        <Field className="sm:col-span-2" label="Ghi chú">
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} disabled={isSaving} className="min-h-24" />
        </Field>
        <Field className="sm:col-span-2" label="Chiến dịch">
          <Input
            value={sourceCampaign}
            onChange={(event) => setSourceCampaign(event.target.value)}
            disabled={isSaving}
            placeholder="facebook, zalo, hotline..."
          />
        </Field>
      </div>

      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          Chọn sản phẩm
        </p>
        <div className="space-y-3">
          <Input 
            placeholder="Gõ để tìm kiếm sản phẩm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSaving}
          />
          <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const checked = selectedProductIds.includes(product.id);
                return (
                  <label
                    key={product.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-[16px] border px-4 py-3 ${
                      checked
                        ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)]"
                        : "border-[var(--color-border)] bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProduct(product.id)}
                      disabled={isSaving || product.stockStatus === "out_of_stock"}
                      className="mt-1 size-4"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-foreground)]">{product.name}</p>
                      <p className="text-sm text-[var(--color-foreground-soft)]">
                        {product.price.toLocaleString("vi-VN")}đ · {product.stockStatus}
                      </p>
                    </div>
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-[var(--color-foreground-soft)] py-2 text-center">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
        </div>
      </section>

      {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

      <Button onClick={handleSubmit} loading={isSaving}>
        Tạo đơn hàng
      </Button>
    </Card>
  );
}

function Field({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
