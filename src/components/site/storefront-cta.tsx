import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, PackageOpen, Box, HeadphonesIcon, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

import anh1 from "@/assets/images/me/anh1.jpg";
import anh2 from "@/assets/images/me/anh2.jpg";

interface StorefrontCtaProps {
  title: string;
  description: string;
  primaryLabel?: string | null;
  secondaryLabel?: string | null;
}

export function StorefrontCta({
  title,
  description,
  primaryLabel,
}: StorefrontCtaProps) {
  return (
    <div id="about" className="bg-white rounded-[40px] p-6 shadow-sm border border-[var(--color-border)] flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
      
      {/* Left: Images Collage */}
      <div className="relative w-full lg:w-[350px] aspect-[4/3] lg:aspect-square shrink-0">
         <div className="absolute top-0 right-4 w-[65%] h-[80%] rounded-3xl overflow-hidden shadow-lg z-10 border-4 border-white transition-all duration-300 hover:z-30 hover:scale-105">
            <Image 
               src={anh1} 
               alt="Về mình 1" 
               fill 
               className="object-cover"
            />
         </div>
         <div className="absolute bottom-0 left-4 w-[60%] h-[75%] rounded-3xl overflow-hidden shadow-lg z-20 border-4 border-white transition-all duration-300 hover:z-30 hover:scale-105">
            <Image 
               src={anh2} 
               alt="Về mình 2" 
               fill 
               className="object-cover"
            />
         </div>
      </div>

      {/* Center: Info */}
      <div className="flex-1 space-y-4 text-center lg:text-left">
         <div className="space-y-1">
            <p className="font-heading italic text-[var(--color-primary-strong)] flex items-center justify-center lg:justify-start gap-2 text-lg">
               Hello, mình là <Heart className="size-4" />
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-[var(--color-foreground)]">
              {title}
            </h2>
         </div>
         <p className="text-sm sm:text-base text-[var(--color-foreground-soft)] leading-relaxed max-w-md mx-auto lg:mx-0">
           {description}
         </p>
         <div className="pt-2">
            <Button asChild size="lg" className="rounded-full px-8 bg-[var(--color-primary-strong)] hover:bg-[var(--color-primary)] text-white shadow-md">
              <Link href="/about">{primaryLabel ?? "Tìm hiểu thêm"}</Link>
            </Button>
         </div>
      </div>

      {/* Right: Promises */}
      <div className="w-full lg:w-[300px] shrink-0 space-y-5 bg-pink-50/50 p-6 rounded-3xl border border-pink-100/50">
         <div className="flex gap-4">
            <ShieldCheck className="size-6 shrink-0 text-[var(--color-primary-strong)]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[var(--color-foreground)]">Cam kết chính hãng 100%</p>
         </div>
         <div className="flex gap-4">
            <PackageOpen className="size-6 shrink-0 text-[var(--color-primary-strong)]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[var(--color-foreground)]">Hàng new / seal hoặc swatch nhẹ</p>
         </div>
         <div className="flex gap-4">
            <Box className="size-6 shrink-0 text-[var(--color-primary-strong)]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[var(--color-foreground)]">Pack hàng cẩn thận</p>
         </div>
         <div className="flex gap-4">
            <HeadphonesIcon className="size-6 shrink-0 text-[var(--color-primary-strong)]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[var(--color-foreground)]">Hỗ trợ nhiệt tình 24/7</p>
         </div>
      </div>
    </div>
  );
}
