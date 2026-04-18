import type { ReactNode } from "react";

import backgroundImage from "@/assets/background.png";
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
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at top, rgba(251, 228, 234, 0.82), rgba(255, 248, 249, 0) 34%),
            linear-gradient(180deg, rgba(255, 253, 253, 0.78) 0%, rgba(255, 248, 249, 0.92) 100%),
            url(${backgroundImage.src})
          `,
          backgroundPosition: "center top, center, center top",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundSize: "cover, cover, cover",
          opacity: 0.48,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,rgba(255,248,249,0.68)_34%,rgba(255,248,249,0.92)_100%)]"
      />
      <QuickOrderShell>
        <div className="relative z-10">
          <SiteHeader phone={settings.brandPhone} primaryCtaLabel={settings.primaryCtaLabel} />
          <div className="flex min-h-[calc(100vh-80px)] flex-col">
            <main className="flex-1 pb-24 md:pb-0">{children}</main>
            <SiteFooter
              phone={settings.brandPhone}
              zaloUrl={settings.zaloUrl}
              announcement={settings.publicAnnouncement}
            />
          </div>
        </div>
      </QuickOrderShell>
    </div>
  );
}
