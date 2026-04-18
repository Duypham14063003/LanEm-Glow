import { SearchX } from "lucide-react";

import { formatCompactDate } from "@/lib/utils";
import type { OrderAdminListItem } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";

function getStatusVariant(status: OrderAdminListItem["status"]) {
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

export function OrdersTable({
  items,
  selectedOrderId,
}: {
  items: OrderAdminListItem[];
  selectedOrderId?: string;
}) {
  if (items.length === 0) {
    return (
      <Card className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
          <SearchX className="size-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="font-heading text-2xl text-[var(--color-foreground)]">Chưa có đơn phù hợp</p>
          <p className="text-sm text-[var(--color-foreground-soft)]">
            Thử đổi bộ lọc hoặc tìm theo số điện thoại, mã đơn hàng.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Đơn hàng</TableHeaderCell>
                <TableHeaderCell>Khách</TableHeaderCell>
                <TableHeaderCell>Sản phẩm</TableHeaderCell>
                <TableHeaderCell>Trạng thái</TableHeaderCell>
                <TableHeaderCell>Thời gian</TableHeaderCell>
                <TableHeaderCell className="text-right">Chi tiết</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.orderId} className={selectedOrderId === item.orderId ? "bg-[var(--color-surface-muted)]" : undefined}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-semibold">{item.orderId}</p>
                      {item.duplicateFlag ? <Badge variant="warning">Đơn trùng</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{item.customerName || "Khách chưa để tên"}</p>
                      <p className="text-xs text-[var(--color-foreground-soft)]">{item.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-2 text-sm text-[var(--color-foreground-soft)]">
                      {item.selectedProductNames.join(", ")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-[var(--color-foreground-soft)]">
                      {formatCompactDate(item.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="secondary">
                      <a href={`/admin/orders?selectedOrderId=${encodeURIComponent(item.orderId)}`}>Mở</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid gap-4 lg:hidden">
        {items.map((item) => (
          <Card key={item.orderId} className={selectedOrderId === item.orderId ? "border-[var(--color-primary)]" : undefined}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{item.orderId}</p>
                  <p className="mt-1 text-sm text-[var(--color-foreground-soft)]">{item.phone}</p>
                </div>
                <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
              </div>
              <p className="text-sm text-[var(--color-foreground-soft)]">
                {item.customerName || "Khách chưa để tên"} · {item.itemCount} món
              </p>
              <p className="line-clamp-2 text-sm text-[var(--color-foreground-soft)]">
                {item.selectedProductNames.join(", ")}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  {formatCompactDate(item.createdAt)}
                </span>
                <Button asChild size="sm" variant="secondary">
                  <a href={`/admin/orders?selectedOrderId=${encodeURIComponent(item.orderId)}`}>Xem chi tiết</a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
