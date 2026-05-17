import type { ReactNode, CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
  style?: CSSProperties;
}

export function PageSection({
  children,
  className,
  contentClassName,
  id,
  style,
}: PageSectionProps) {
  return (
    <section id={id} style={style} className={cn("px-6 py-4 sm:px-10 sm:py-6 lg:px-12", className)}>
      <div className={cn("mx-auto w-full max-w-7xl", contentClassName)}>{children}</div>
    </section>
  );
}
