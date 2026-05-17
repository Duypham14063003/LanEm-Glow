"use client";

import { useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { formatDateTime } from "@/lib/utils";
import type { OrderAdminListItem, OrderStatus } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";

const orderStatuses: OrderStatus[] = [
  "new",
  "contacted",
  "confirmed",
  "closed",
  "cancelled",
  "duplicate",
  "invalid",
];

function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case "new":
      return "info";
    case "contacted":
      return "warning";
    case "confirmed":
      return "success";
    case "closed":
      return "neutral";
    case "cancelled":
    case "invalid":
      return "error";
    case "duplicate":
      return "warning";
    default:
      return "neutral";
  }
}

export function OrderDetailPanel({ initialOrder }: { initialOrder: OrderAdminListItem | null }) {
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(initialOrder?.status ?? "new");
  const [adminNote, setAdminNote] = useState(initialOrder?.adminNote ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!order) {
    return (
      <EmptyState
        title="Chọn một đơn để xem chi tiết"
        description="Bảng bên trái giúp bạn mở nhanh một order để cập nhật trạng thái và ghi chú follow-up."
      />
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.orderId)}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status,
          adminNote,
        }),
      });

      const payload = (await response.json()) as
        | { order: OrderAdminListItem }
        | { error?: string };

      if (!response.ok) {
        setError("error" in payload ? payload.error ?? "Không thể cập nhật đơn hàng." : "Không thể cập nhật đơn hàng.");
        return;
      }

      const nextOrder = (payload as { order: OrderAdminListItem }).order;
      setOrder(nextOrder);
      setStatus(nextOrder.status);
      setAdminNote(nextOrder.adminNote);
      setMessage("Đã lưu thay đổi cho đơn hàng.");
      trackEvent("admin_order_updated", {
        orderId: nextOrder.orderId,
        status: nextOrder.status,
      });
    } catch {
      setError("Không thể kết nối để cập nhật đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    setStatus("cancelled");
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(order.orderId)}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          adminNote,
        }),
      });

      const payload = (await response.json()) as
        | { order: OrderAdminListItem }
        | { error?: string };

      if (!response.ok) {
        setError("error" in payload ? payload.error ?? "Không thể lưu thay đổi đơn hàng." : "Không thể lưu thay đổi đơn hàng.");
        return;
      }

      const nextOrder = (payload as { order: OrderAdminListItem }).order;
      setOrder(nextOrder);
      setStatus(nextOrder.status);
      setAdminNote(nextOrder.adminNote);
      setMessage("Đã lưu đơn hàng ở trạng thái cancelled.");
    } catch {
      setError("Không thể kết nối để cập nhật đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="space-y-5 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">Chi tiết đơn</p>
          <h2 className="mt-1 text-3xl text-[var(--color-foreground)]">{order.orderId}</h2>
        </div>
        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Số điện thoại" value={order.phone} />
        <Info label="Khách hàng" value={order.customerName || "Khách chưa để tên"} />
        <Info label="Tạo lúc" value={formatDateTime(order.createdAt)} />
        <Info label="Đã xử lý" value={formatDateTime(order.processedAt)} />
        {/* <Info label="Nguồn vào" value={order.sourcePage || "N/A"} />
        <Info label="Chiến dịch" value={order.sourceCampaign || "N/A"} /> */}
      </div>

      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          Sản phẩm đã chọn
        </p>
        <div className="space-y-2">
          {order.selectedProductNames.map((name, index) => (
            <div
              key={`${order.selectedProductIds[index] ?? name}-${index}`}
              className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3"
            >
              <p className="font-medium text-[var(--color-foreground)]">{name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {order.selectedProductIds[index] ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          Ghi chú khách
        </p>
        <div className="rounded-[16px] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground-soft)]">
          {order.customerNote || "Khách chưa để lại ghi chú."}
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]" htmlFor="status">
          Trạng thái xử lý
        </label>
        <select
          id="status"
          className="h-12 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          disabled={isSaving}
        >
          {orderStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {/* <section className="space-y-3">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]" htmlFor="admin-note">
          Ghi chú admin
        </label>
        <Textarea
          id="admin-note"
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          disabled={isSaving}
          placeholder="Ví dụ: gọi lại sau 9h sáng, khách muốn xác nhận combo..."
        />
      </section> */}

      {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} loading={isSaving}>
          Lưu thay đổi
        </Button>
        <Button variant="secondary" onClick={handleArchive} disabled={isSaving || order.status === "cancelled"}>
          Đánh dấu hủy
        </Button>
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[var(--color-border)] bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[var(--color-foreground)]">{value}</p>
    </div>
  );
}
