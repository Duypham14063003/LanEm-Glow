import React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-[var(--color-success)] ring-1 ring-emerald-100",
  warning: "bg-amber-50 text-[var(--color-warning)] ring-1 ring-amber-100",
  error: "bg-rose-50 text-[var(--color-danger)] ring-1 ring-rose-100",
  info: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
  neutral:
    "bg-[var(--color-surface-muted)] text-[var(--color-foreground-soft)] ring-1 ring-[var(--color-border)]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
