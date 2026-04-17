import { ShieldCheck, Sparkles, Truck, UserRoundSearch } from "lucide-react";

import { Card } from "@/components/ui/card";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Hàng chính hãng",
    description: "Nguồn sản phẩm rõ ràng, ưu tiên những món skincare dễ tin dùng mỗi ngày.",
  },
  {
    icon: UserRoundSearch,
    title: "Tư vấn theo nhu cầu da",
    description: "Không cần biết bắt đầu từ đâu, bạn vẫn có thể chọn được routine phù hợp.",
  },
  {
    icon: Truck,
    title: "Không cần thanh toán trước",
    description: "Trải nghiệm đặt nhẹ nhàng, xác nhận thủ công sau khi đã được tư vấn.",
  },
  {
    icon: Sparkles,
    title: "Liên hệ nhanh",
    description: "CTA rõ ràng, phản hồi gọn và ưu tiên mobile-first cho khách đang xem nhanh.",
  },
];

export function TrustStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {trustItems.map((item) => (
        <Card key={item.title} className="space-y-3 bg-white/90">
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <item.icon className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-foreground-soft)]">{item.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
