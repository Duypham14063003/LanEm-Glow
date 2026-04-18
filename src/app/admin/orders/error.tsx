"use client";

import { useEffect } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <AdminTopbar
        title="Đơn hàng"
        description="Theo dõi lead mới, mở chi tiết và cập nhật trạng thái follow-up ngay trong admin."
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <EmptyState
          title="Không thể tải dữ liệu đơn hàng"
          description="Hệ thống gặp sự cố khi tải admin orders. Bạn có thể thử lại ngay."
          actionLabel="Tải lại"
          actionProps={{
            onClick: reset,
          }}
        />
      </div>
    </div>
  );
}
