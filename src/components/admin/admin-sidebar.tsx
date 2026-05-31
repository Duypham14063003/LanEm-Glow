"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, PackageSearch, Settings } from "lucide-react";

import logoImage from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/lananh113388/orders", label: "Đơn hàng", icon: ClipboardList },
  { href: "/lananh113388/products", label: "Sản phẩm", icon: PackageSearch },
  { href: "/lananh113388/settings", label: "Cài đặt", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[var(--color-border)] bg-white/90 px-4 py-4 lg:min-h-screen lg:w-[220px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link href="/lananh113388/orders" className="min-w-fit">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[var(--color-border)] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-4 ring-[color:color-mix(in_srgb,white_70%,transparent)]">
              <Image
                src={logoImage}
                alt="LanEm Glow"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-3xl leading-none text-[var(--color-foreground)]">
                LanEm Glow
              </span>
              <span className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Admin
              </span>
            </div>
          </div>
        </Link>
      </div>

      <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-8 lg:flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                active
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-foreground)]",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
