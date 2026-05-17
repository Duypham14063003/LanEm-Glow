import Link from "next/link";
import { Sparkles } from "lucide-react";

interface ConcernScrollerProps {
  concerns: string[];
  activeConcern?: string;
}

export function ConcernScroller({ concerns, activeConcern }: ConcernScrollerProps) {
  return (
    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {concerns.map((concern) => {
        const normalized = concern.toLowerCase();
        const isActive = normalized === activeConcern?.toLowerCase();

        return (
          <Link key={concern} href={`/products?concern=${encodeURIComponent(normalized)}`} className="group flex flex-col items-center gap-3 w-[88px] sm:w-[104px] shrink-0">
            <div className={`w-full aspect-square rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'bg-[var(--color-primary-strong)] text-white shadow-md' : 'bg-white text-[var(--color-primary-strong)] hover:bg-pink-50 border border-[var(--color-border)] shadow-sm'}`}>
               <Sparkles className="size-6 mb-1 opacity-80" />
            </div>
            <span className={`text-xs text-center font-medium line-clamp-2 ${isActive ? 'text-[var(--color-primary-strong)] font-bold' : 'text-[var(--color-foreground-soft)] group-hover:text-[var(--color-primary-strong)]'}`}>
               {concern.charAt(0).toUpperCase() + concern.slice(1)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
