import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, active = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-page)] disabled:pointer-events-none disabled:opacity-50",
          active
            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
            : "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-muted)]",
          className
        )}
        aria-pressed={active}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Chip.displayName = "Chip";
