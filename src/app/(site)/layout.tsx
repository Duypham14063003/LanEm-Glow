import type { ReactNode } from "react";

import { QuickOrderShell } from "@/components/site/quick-order-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicSettings } from "@/services/settings";

async function getSiteSettings() {
  try {
    return await getPublicSettings();
  } catch {
    return {
      brandPhone: null,
      zaloUrl: null,
      publicAnnouncement:
        "Thông tin được dùng để tư vấn và xác nhận đơn thủ công. Bạn không cần thanh toán online trước.",
      primaryCtaLabel: "Xem sản phẩm",
      secondaryCtaLabel: "Nhận tư vấn",
    };
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-transparent">
      <QuickOrderShell>
        <SiteHeader phone={settings.brandPhone} primaryCtaLabel={settings.primaryCtaLabel} />
        <div className="flex min-h-[calc(100vh-80px)] flex-col">
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <SiteFooter
            phone={settings.brandPhone}
            zaloUrl={settings.zaloUrl}
            announcement={settings.publicAnnouncement}
          />
        </div>
      </QuickOrderShell>
    </div>
  );
}
