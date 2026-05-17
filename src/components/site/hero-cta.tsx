import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

import bgImage from "@/assets/images/me/backgroud.png";
import tiktokProfile from "@/assets/images/me/profile_tiktok.png";
import anh1 from "@/assets/images/me/anh1.jpg";

interface HeroCtaProps {
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
}

export function HeroCta({ primaryCtaLabel }: HeroCtaProps) {
  return (
    <section className="relative w-full pt-20 pb-16 overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
         <Image 
            src={bgImage} 
            alt="Background" 
            fill 
            className="object-cover object-center opacity-80" 
            priority
         />
         <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 animate-slide-up relative">
          {/* Decorative heart */}
          <div className="absolute -right-4 top-12 text-pink-400 rotate-12 opacity-80 hidden md:block">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-[var(--color-foreground)]">
            Pass lại makeup <br/>
            <span className="text-[var(--color-primary-strong)]">chính hãng được</span> <br/>
            gửi từ các brand
          </h1>
          <div className="space-y-1.5 text-base sm:text-lg text-[var(--color-foreground-soft)] font-medium">
            <p>Hầu hết là new/seal hoặc swatch nhẹ</p>
            <p>Giá mềm hơn retail 20-50%</p>
          </div>
          <div className="pt-4">
            <Button asChild size="lg" className="rounded-full px-8 h-12 bg-[var(--color-primary-strong)] hover:bg-[var(--color-primary)] text-white shadow-md transition-transform hover:scale-105">
              <Link href="/products" className="flex items-center gap-2">
                {primaryCtaLabel ?? "Xem sản phẩm"}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Content - Polaroid Images */}
        <div className="relative animate-scale-in h-[450px] lg:h-[550px] flex items-center justify-center">
          
          {/* First Polaroid (Tiktok Profile) */}
          <div className="absolute z-10 w-[240px] md:w-[280px] aspect-[3/4] bg-white p-3 pb-8 shadow-2xl rounded-sm -rotate-6 -translate-x-16 transition-transform hover:rotate-0 hover:scale-105 hover:z-30 duration-300">
             {/* Tape */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/90 rotate-[-4deg] shadow-sm z-20"></div>
             
             <div className="relative w-full h-full bg-black overflow-hidden rounded-sm border border-gray-100">
               <Image
                 src={tiktokProfile}
                 alt="Tiktok Profile"
                 fill
                 className="object-contain"
               />
             </div>
          </div>

          {/* Second Polaroid (Photo 1) */}
          <div className="absolute z-20 w-[240px] md:w-[280px] aspect-[3/4] bg-white p-3 pb-8 shadow-2xl rounded-sm rotate-6 translate-x-16 translate-y-8 transition-transform hover:rotate-0 hover:scale-105 hover:z-30 duration-300">
             {/* Tape */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/90 rotate-[5deg] shadow-sm z-20"></div>
             
             <div className="relative w-full h-full bg-gray-100 overflow-hidden rounded-sm border border-gray-100">
               <Image
                 src={anh1}
                 alt="Photo 1"
                 fill
                 className="object-cover"
               />
             </div>
          </div>

          {/* Decorative heart floating right */}
          <div className="absolute -right-8 bottom-20 text-pink-400 -rotate-12 opacity-80 hidden lg:block">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
        </div>
      </div>
    </section>
  );
}

