interface SiteFooterProps {
  phone: string | null;
  zaloUrl: string | null;
  announcement: string | null;
}

const footerLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Chính sách riêng tư", href: "#privacy" },
];

export function SiteFooter({ phone, zaloUrl, announcement }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <div>
            <p className="font-heading text-3xl text-[var(--color-foreground)]">LanEm Glow</p>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-foreground-soft)]">
              Website skincare theo hướng tinh gọn, giúp khách tìm sản phẩm nhanh và để lại
              nhu cầu tư vấn với ít ma sát nhất.
            </p>
          </div>
          {announcement ? (
            <p
              id="privacy"
              className="rounded-[var(--radius-card)] bg-[var(--color-surface-muted)] px-4 py-3 text-sm text-[var(--color-foreground-soft)]"
            >
              {announcement}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Điều hướng
            </p>
            <div className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[var(--color-foreground-soft)] transition hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Liên hệ
            </p>
            <div className="mt-3 space-y-2 text-sm text-[var(--color-foreground-soft)]">
              {phone ? <a href={`tel:${phone}`}>Hotline: {phone}</a> : <p>Tư vấn theo nhu cầu da</p>}
              {zaloUrl ? (
                <a href={zaloUrl} target="_blank" rel="noreferrer">
                  Chat Zalo
                </a>
              ) : (
                <p>Không cần thanh toán trước</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
