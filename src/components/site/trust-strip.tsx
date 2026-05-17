import { ShieldCheck, Heart, Truck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    description: "Được gửi từ brand / PR package",
  },
  {
    icon: Heart,
    title: "Giá pass siêu mềm",
    description: "Pass nhanh để dọn vanity",
  },
  {
    icon: Truck,
    title: "Ship toàn quốc",
    description: "Đóng gói kỹ & check hàng trước khi gửi",
  },
];

export function TrustStrip() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-center gap-4 px-4 py-2 first:pt-0 last:pb-0 md:py-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-primary-strong)]">
              <item.icon className="size-6" fill="currentColor" />
            </div>
            <div>
              <h3 className="font-heading text-[15px] font-bold text-[var(--color-foreground)] leading-tight">{item.title}</h3>
              <p className="mt-0.5 text-xs text-[var(--color-foreground-soft)] max-w-[200px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
