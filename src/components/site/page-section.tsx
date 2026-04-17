import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageSection({
  children,
  className,
  contentClassName,
}: PageSectionProps) {
  return (
    <section className={cn("px-4 py-10 sm:px-6 sm:py-14 lg:px-8", className)}>
      <div className={cn("mx-auto w-full max-w-6xl", contentClassName)}>{children}</div>
    </section>
  );
}
