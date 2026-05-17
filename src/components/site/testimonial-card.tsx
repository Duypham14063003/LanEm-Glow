import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

export function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[var(--color-border)] flex flex-col gap-4 relative min-h-[160px]">
      <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
           <Star key={star} className="size-4 text-yellow-400 fill-yellow-400" />
         ))}
      </div>
      <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed pr-10">
        {quote}
      </p>
      
      {/* Avatar placed at bottom right */}
      <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full overflow-hidden border border-[var(--color-border)]">
         <Image 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=fbe4ea&color=d86c87`}
            alt={author}
            fill
            className="object-cover"
         />
      </div>
    </div>
  );
}
