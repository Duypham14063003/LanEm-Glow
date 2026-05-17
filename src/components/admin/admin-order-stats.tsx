import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { OrderAdminListItem, Product } from "@/types";

export function AdminOrderStats({
  allOrders,
  products,
}: {
  allOrders: OrderAdminListItem[];
  products: Product[];
}) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let todayOrders = 0;
  let todayRevenue = 0;
  let monthOrders = 0;
  let monthRevenue = 0;
  let totalOrders = 0;
  let totalRevenue = 0;

  for (const order of allOrders) {
    if (order.status === "cancelled" || order.status === "invalid" || order.status === "duplicate") {
      continue;
    }

    const orderTime = new Date(order.createdAt).getTime();
    
    let orderValue = 0;
    for (const pid of order.selectedProductIds) {
      const p = products.find((p) => p.id === pid);
      if (p) orderValue += p.price;
    }

    totalOrders++;
    totalRevenue += orderValue;

    if (orderTime >= startOfMonth) {
      monthOrders++;
      monthRevenue += orderValue;
      if (orderTime >= startOfDay) {
        todayOrders++;
        todayRevenue += orderValue;
      }
    }
  }

  const formatPrice = (val: number) => new Intl.NumberFormat("vi-VN").format(val) + "đ";

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <Card className="p-4 bg-white/80 border-[var(--color-border)] shadow-sm">
        <p className="text-sm font-medium text-[var(--color-foreground-soft)]">Hôm nay</p>
        <p className="mt-2 text-2xl font-bold text-[var(--color-foreground)]">{formatPrice(todayRevenue)}</p>
        <p className="text-sm text-[var(--color-muted)]">{todayOrders} đơn</p>
      </Card>
      <Card className="p-4 bg-white/80 border-[var(--color-border)] shadow-sm">
        <p className="text-sm font-medium text-[var(--color-foreground-soft)]">Tháng này</p>
        <p className="mt-2 text-2xl font-bold text-[var(--color-foreground)]">{formatPrice(monthRevenue)}</p>
        <p className="text-sm text-[var(--color-muted)]">{monthOrders} đơn</p>
      </Card>
      <Card className="p-4 bg-white/80 border-[var(--color-border)] shadow-sm">
        <p className="text-sm font-medium text-[var(--color-foreground-soft)]">Tất cả (hợp lệ)</p>
        <p className="mt-2 text-2xl font-bold text-[var(--color-foreground)]">{formatPrice(totalRevenue)}</p>
        <p className="text-sm text-[var(--color-muted)]">{totalOrders} đơn</p>
      </Card>
      
      <div className="sm:col-span-3 flex items-center gap-2 mt-2">
        <a 
          href="https://docs.google.com/spreadsheets/d/1B_iR-qQCtfNJGl9pGncRqBZhd6-SHZeS9HZFPwxxWCI/edit?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary-strong)] hover:underline"
        >
          <ExternalLink className="size-4" />
          Link sheet gốc : https://docs.google.com/spreadsheets/d/1B_iR-qQCtfNJGl9pGncRqBZhd6-SHZeS9HZFPwxxWCI/edit?usp=sharing
        </a>
      </div>
    </div>
  );
}
