import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[220px_1fr]">
      <AdminSidebar />
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
