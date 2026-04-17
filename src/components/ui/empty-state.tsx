import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, type ButtonProps } from "@/components/ui/button";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actionLabel?: string;
  actionProps?: ButtonProps;
}

export function EmptyState({
  className,
  title,
  description,
  actionLabel,
  actionProps,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-sheet)] border border-dashed border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-accent-soft)_60%,white)] p-8 text-center shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-white text-[var(--color-accent)] shadow-[var(--shadow-soft)]">
        <Sparkles className="size-6" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-2xl text-[var(--color-foreground)]">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-foreground-soft)]">
        {description}
      </p>
      {actionLabel ? (
        <div className="mt-5">
          <Button {...actionProps}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
