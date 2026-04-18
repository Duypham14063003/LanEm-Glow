import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import logoImage from "@/assets/logo.png";
import { buildMetadata, getSiteUrl } from "@/lib/metadata";

import "./globals.css";

const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: [{ url: logoImage.src, type: "image/png" }],
    shortcut: [{ url: logoImage.src, type: "image/png" }],
    apple: [{ url: logoImage.src, type: "image/png" }],
  },
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
      <body className={fontSans.variable}>{children}</body>
    </html>
  );
}
