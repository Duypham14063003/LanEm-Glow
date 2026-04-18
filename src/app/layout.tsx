import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";

import { buildMetadata, getSiteUrl } from "@/lib/metadata";

import "./globals.css";

const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fontHeading = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildMetadata({
    title: "LanEm Glow | Skincare storefront tinh gọn cho mobile",
    description:
      "LanEm Glow giúp bạn xem nhanh sản phẩm skincare, chọn theo concern và để lại số để được tư vấn thủ công nhẹ nhàng hơn.",
    path: "/",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${fontSans.variable} ${fontHeading.variable}`}>{children}</body>
    </html>
  );
}
