import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-28 w-full rounded-[var(--radius-input)] border bg-white px-4 py-3 text-sm text-[var(--color-foreground)] shadow-[var(--shadow-inset)] transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-muted)]",
          hasError
            ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]"
            : "border-[var(--color-border)] focus-visible:border-[var(--color-primary)]",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
