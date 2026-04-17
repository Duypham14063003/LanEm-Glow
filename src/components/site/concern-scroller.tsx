import Link from "next/link";

import { Chip } from "@/components/ui/chip";

interface ConcernScrollerProps {
  concerns: string[];
  activeConcern?: string;
}

export function ConcernScroller({ concerns, activeConcern }: ConcernScrollerProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {concerns.map((concern) => {
        const normalized = concern.toLowerCase();

        return (
          <Link key={concern} href={`/products?concern=${encodeURIComponent(normalized)}`}>
            <Chip active={normalized === activeConcern?.toLowerCase()}>{concern}</Chip>
          </Link>
        );
      })}
    </div>
  );
}
