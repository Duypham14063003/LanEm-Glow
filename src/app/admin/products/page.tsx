import { AdminTopbar } from "@/components/admin/admin-topbar";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminProductsPage() {
  return (
    <div>
      <AdminTopbar
        title="Sản phẩm"
        description="Module này sẽ được mở rộng ở milestone sau. Hiện tại catalog vẫn được quản lý từ Google Sheets."
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <EmptyState
          title="Chưa bật chỉnh sửa sản phẩm trong admin"
          description="Milestone hiện tại tập trung vào xử lý đơn hàng. Bạn vẫn có thể cập nhật catalog trực tiếp trong Google Sheets."
        />
      </div>
    </div>
  );
}
