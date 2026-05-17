import Link from "next/link";
import backgroundImage from "@/assets/background.png";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicSettings } from "@/services/settings";
import { QuickOrderShell } from "@/components/site/quick-order-shell";

export default async function NotFound() {
  let settings;
  try {
    settings = await getPublicSettings();
  } catch {
    settings = {
      brandPhone: null,
      zaloUrl: null,
      publicAnnouncement:
        "Thông tin được dùng để tư vấn và xác nhận đơn thủ công. Bạn không cần thanh toán online trước.",
      primaryCtaLabel: "Xem sản phẩm",
      secondaryCtaLabel: "Nhận tư vấn",
    };
  }

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
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader phone={settings.brandPhone} primaryCtaLabel={settings.primaryCtaLabel} />
          
          <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20 relative">
            <h1 className="font-heading text-[120px] leading-none md:text-[180px] text-[var(--color-primary)] opacity-20 font-bold mb-4">404</h1>
            <h2 className="font-heading text-3xl md:text-4xl text-[var(--color-foreground)] mb-6 -mt-12 md:-mt-20 z-10">Trang không tồn tại</h2>
            <p className="text-[var(--color-foreground-soft)] max-w-md mx-auto mb-10 text-lg z-10">
              Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể đường dẫn đã bị thay đổi hoặc không còn tồn tại.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-[var(--shadow-card)] z-10">
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </main>

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
