import { AdminSettingsWorkspace } from "@/components/admin/admin-settings-workspace";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAdminSettings } from "@/services/settings";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <AdminTopbar
        title="Cài đặt"
        description="Quản lý các cấu hình storefront đang được public site sử dụng trực tiếp."
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <AdminSettingsWorkspace initialSettings={settings} />
      </div>
    </div>
  );
}
