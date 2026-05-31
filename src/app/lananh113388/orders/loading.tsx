import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersLoading() {
  return (
    <div>
      <AdminTopbar
        title="Đơn hàng"
        description="Theo dõi lead mới, mở chi tiết và cập nhật trạng thái follow-up ngay trong admin."
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Skeleton className="h-28 w-full rounded-[var(--radius-card)]" />
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
          <Card className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid gap-3 border-b border-[var(--color-border)] pb-4 last:border-b-0">
                <Skeleton className="h-5 w-40 rounded-full" />
                <Skeleton className="h-4 w-64 rounded-full" />
              </div>
            ))}
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-24 w-full rounded-[var(--radius-card)]" />
            <Skeleton className="h-28 w-full rounded-[var(--radius-card)]" />
            <Skeleton className="h-12 w-full rounded-[var(--radius-input)]" />
          </Card>
        </div>
      </div>
    </div>
  );
}
