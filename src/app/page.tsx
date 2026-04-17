import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const concerns = ["Da mụn", "Phục hồi", "Làm sáng", "Chống nắng"];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(251,228,234,0.85),rgba(255,248,249,1))] p-6 shadow-[var(--shadow-card)] sm:p-10">
          <Badge variant="info" className="mb-4">
            Theme Foundation Preview
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
                LanEm Glow
              </p>
              <div className="space-y-4">
                <h1 className="font-heading text-5xl leading-[1.05] tracking-[-0.03em] text-[var(--color-foreground)] sm:text-6xl">
                  Nền giao diện mềm mại, sáng và sẵn sàng cho các milestone tiếp theo.
                </h1>
                <p className="max-w-2xl text-base text-[var(--color-foreground-soft)] sm:text-lg">
                  Trang này là bề mặt kiểm tra theme cho typography, token màu, spacing và UI
                  primitives trước khi mình xây catalog, quick order và admin panel.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">
                  Xem primitives
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button variant="secondary" size="lg">
                  Để lại số để được tư vấn
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {concerns.map((concern, index) => (
                  <Chip key={concern} active={index === 0}>
                    {concern}
                  </Chip>
                ))}
              </div>
            </div>

            <Card className="grid gap-4 bg-white/90 p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--color-foreground-soft)]">Quick order mock</p>
                  <h2 className="mt-1 font-heading text-3xl text-[var(--color-foreground)]">
                    Form states
                  </h2>
                </div>
                <Badge variant="success">Ready</Badge>
              </div>
              <div className="space-y-3">
                <Input placeholder="Số điện thoại của bạn" />
                <Input hasError defaultValue="0123" aria-invalid="true" />
                <Textarea placeholder="Ghi chú thêm cho làn da hoặc nhu cầu chăm sóc" />
                <div className="flex flex-wrap gap-3">
                  <Button>Gửi lựa chọn</Button>
                  <Button variant="ghost">Huỷ</Button>
                  <Button variant="danger">Xoá</Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Glow nhẹ, không kẹo ngọt",
              body: "Tone blush ấm, nền sáng và bóng đổ mềm để giữ cảm giác beauty editorial nhưng vẫn dễ gần.",
            },
            {
              icon: HeartHandshake,
              title: "Tối ưu cho chuyển đổi",
              body: "Primitives ưu tiên mobile readability, CTA rõ và phản hồi trạng thái nhanh cho quick-order flow.",
            },
            {
              icon: ShieldCheck,
              title: "Dùng lại lâu dài",
              body: "Token và component được gom về nền tảng chung để storefront và admin không bị lệch phong cách.",
            },
          ].map((item) => (
            <Card key={item.title} className="space-y-3">
              <item.icon className="size-5 text-[var(--color-accent)]" aria-hidden="true" />
              <h2 className="font-heading text-3xl text-[var(--color-foreground)]">{item.title}</h2>
              <p className="text-sm text-[var(--color-foreground-soft)]">{item.body}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-foreground-soft)]">Shared primitives</p>
                <h2 className="font-heading text-4xl text-[var(--color-foreground)]">
                  Product card states
                </h2>
              </div>
              <Badge variant="neutral">Catalog-ready</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="space-y-4">
                <div className="aspect-[4/3] rounded-[calc(var(--radius-card)-6px)] bg-[linear-gradient(135deg,#fff,#fbe4ea)]" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                    Serum phục hồi glow barrier
                  </h3>
                  <p className="text-sm text-[var(--color-foreground-soft)]">
                    Kết cấu nhẹ, làm dịu nhanh và phù hợp da nhạy cảm sau treatment.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Giá bán
                    </p>
                    <p className="text-xl font-semibold text-[var(--color-accent)]">420.000đ</p>
                  </div>
                  <Button>Chọn sản phẩm</Button>
                </div>
              </Card>

              <Card selected className="space-y-4">
                <div className="aspect-[4/3] rounded-[calc(var(--radius-card)-6px)] bg-[linear-gradient(135deg,#fff,#f7ccd6)]" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                      Kem chống nắng velvet touch
                    </h3>
                    <Badge variant="info">Đã chọn</Badge>
                  </div>
                  <p className="text-sm text-[var(--color-foreground-soft)]">
                    Finish mịn ráo, dễ layer trang điểm và không làm bí da.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-[var(--color-accent)]">395.000đ</p>
                    <Badge variant="warning">Best seller</Badge>
                  </div>
                  <Button variant="secondary">Đã chọn</Button>
                </div>
              </Card>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-3xl text-[var(--color-foreground)]">
                  Loading surface
                </h2>
                <Truck className="size-5 text-[var(--color-accent)]" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-40 w-full rounded-[calc(var(--radius-card)-6px)]" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
                <Skeleton className="h-11 w-36 rounded-full" />
              </div>
            </Card>

            <EmptyState
              title="Chưa có sản phẩm nào được chọn"
              description="Khi chưa có dữ liệu hoặc khách chưa chọn gì, component này giữ trải nghiệm nhẹ nhàng thay vì để màn hình trống."
              actionLabel="Xem sản phẩm"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
