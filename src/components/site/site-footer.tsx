import Link from "next/link";

interface SiteFooterProps {
  phone: string | null;
  announcement: string | null;
}

const footerLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Cam kết & lưu ý", href: "/cam-ket-luu-y" },
];

export function SiteFooter({ phone, announcement }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <div>
            <p className="font-heading text-3xl text-[var(--color-foreground)]">LanEm Glow</p>
          </div>
          {announcement ? (
            <p
              className=" px-4 py-3 text-sm text-[var(--color-foreground-soft)]"
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
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[var(--color-foreground-soft)] transition hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Liên hệ
            </p>
            <div className="mt-3 space-y-2 text-sm text-[var(--color-foreground-soft)]">
              {phone ? <a href={`tel:${phone}`}>Hotline: {phone}</a> : <p>Tư vấn theo nhu cầu da</p>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
