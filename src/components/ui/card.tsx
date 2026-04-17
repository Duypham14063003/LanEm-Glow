import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  disabled?: boolean;
}

export function Card({ className, selected = false, disabled = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] transition duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
        selected
          ? "border-[var(--color-primary)] ring-2 ring-[color:color-mix(in_srgb,var(--color-primary)_18%,white)]"
          : "border-[var(--color-border)]",
        disabled && "pointer-events-none opacity-60 grayscale-[0.1]",
        className
      )}
      {...props}
    />
  );
}
