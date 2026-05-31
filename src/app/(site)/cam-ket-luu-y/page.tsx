import type { Metadata } from "next";

import { PageSection } from "@/components/site/page-section";
import { buildMetadata } from "@/lib/metadata";

const notes = [
  "Giá retail/gốc có thể thay đổi theo thị trường hoặc từng sàn TMĐT nên mức giá tham khảo trên web có thể khác ở nơi khác.",
  "Hầu hết sản phẩm là hàng được gửi từ brand/PR package hoặc pass lại nên giá sẽ mềm hơn retail.",
  "Hiệu quả sản phẩm phụ thuộc vào cơ địa và routine của mỗi người.",
  "Shop luôn cố gắng mô tả sản phẩm đúng nhất có thể, nhưng màu sắc/hình ảnh có thể chênh nhẹ do ánh sáng hoặc thiết bị.",
  "Một số sản phẩm có thể là swatch/test nhẹ nhưng vẫn đảm bảo vệ sinh và tình trạng tốt.",
  "Khách được check hàng trước khi nhận để yên tâm hơn khi mua 🫶",
  "Có vấn đề về đơn hàng cứ nhắn shop hỗ trợ, tụi mình không ghost khách đâu 😭",
];

export const metadata: Metadata = buildMetadata({
  title: "Cam kết & lưu ý | LanEm Glow",
  description:
    "Những điều bạn cần biết về giá tham khảo, tình trạng sản phẩm và cam kết hỗ trợ tại LanEm Glow.",
  path: "/cam-ket-luu-y",
});

export default function CommitmentsAndNotesPage() {
  return (
    <PageSection className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl animate-fade-in">
        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/78 shadow-[0_24px_60px_rgba(229,141,161,0.16)] backdrop-blur-sm">
          <div className="bg-[linear-gradient(135deg,rgba(255,233,238,0.92),rgba(255,247,249,0.76))] px-6 py-8 sm:px-10 sm:py-10">
            <p className="font-heading text-base italic text-[var(--color-primary-strong)]">
              Cam kết & lưu ý
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Những điều bạn cần biết ✨
            </h1>
          </div>

          <div className="space-y-4 px-6 py-6 sm:px-10 sm:py-8">
            {notes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-4 text-[15px] leading-7 text-[var(--color-foreground-soft)] shadow-sm"
              >
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageSection>
  );
}
