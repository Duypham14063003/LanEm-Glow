"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag, MessageCircle } from "lucide-react";

import logoImage from "@/assets/logo.png";
import { useSelectedProducts } from "@/hooks/use-selected-products";
import { useQuickOrder } from "@/hooks/use-quick-order";

// Simple TikTok icon SVG since Lucide doesn't have it natively
const TikTokIcon = ({ className }: { className?: string }) => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
   </svg>
);

export function SiteHeader() {
   const { count } = useSelectedProducts();
   const { openQuickOrder } = useQuickOrder();

   return (
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--color-border)] transition-all duration-500">
         {/* Announcement Bar */}
         <div className="bg-[#fbe4ea] py-1.5 px-4 sm:px-8 flex items-center justify-between">
            <div className="hidden sm:block w-[100px]" /> {/* Spacer for centering */}
            <p className="text-[13px] font-medium text-[var(--color-foreground-soft)] text-center flex-1">
               Pass lại makeup chính hãng được gửi từ các brand &bull; Giá mềm hơn retail 20-50%
            </p>
            <div className="flex items-center justify-end gap-3 sm:w-[100px] text-[var(--color-foreground-soft)]">
               <Link href="https://www.tiktok.com/@lananh113388" className="hover:text-[var(--color-primary)] transition-colors">
                  <TikTokIcon className="size-4" />
               </Link>
               <Link href="https://www.facebook.com/lannnnanhhhh" className="hover:text-[var(--color-primary)] transition-colors">
                  <MessageCircle className="size-4" />
               </Link>
            </div>
         </div>

         {/* Main Header */}
         <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-8">
            <Link href="/" className="group flex items-center gap-2">
               <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--color-border)]">
                  <Image src={logoImage} alt="Logo" fill className="object-cover" />
               </div>
               <span className="font-heading text-xl font-medium tracking-tight text-[var(--color-primary-strong)]">
                  LanEm Glow
               </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
               <Link href="/" className="text-sm font-medium text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1">
                  Trang chủ
               </Link>
               <Link href="/products" className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors">
                  Sản phẩm
               </Link>
               <Link href="/categories" className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors">
                  Danh mục
               </Link>
               <Link href="/#feedback" className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors">
                  Feedback
               </Link>
               <Link href="/#about" className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors">
                  Về mình
               </Link>
            </nav>

            <div className="flex items-center gap-5 text-[var(--color-foreground-soft)]">
               <button type="button" className="hover:text-[var(--color-primary)] transition-colors">
                  <Search className="size-5" />
               </button>
               <button type="button" className="hover:text-[var(--color-primary)] transition-colors">
                  <User className="size-5" />
               </button>
               <button 
                  type="button" 
                  className="relative hover:text-[var(--color-primary)] transition-colors"
                  onClick={() => openQuickOrder("bar")}
               >
                  <ShoppingBag className="size-5" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white">
                       {count}
                    </span>
                  )}
               </button>
            </div>
         </div>
      </header>
   );
}

