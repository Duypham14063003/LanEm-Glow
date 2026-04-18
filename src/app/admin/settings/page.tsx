import { AdminTopbar } from "@/components/admin/admin-topbar";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminTopbar
        title="Cài đặt"
        description="Cấu hình email nhận đơn, duplicate window và cache sẽ được đưa vào admin ở các milestone tiếp theo."
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <EmptyState
          title="Cài đặt admin sẽ đến ở milestone sau"
          description="Hiện tại những cấu hình này vẫn được quản lý qua biến môi trường và Google Sheets."
        />
      </div>
    </div>
  );
}
