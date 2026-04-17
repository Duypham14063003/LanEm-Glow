import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";

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
  title: "LanEm Glow",
  description: "Theme foundation and UI primitives for the LanEm Glow storefront.",
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
