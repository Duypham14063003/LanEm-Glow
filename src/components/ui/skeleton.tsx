import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-card)] bg-[linear-gradient(90deg,var(--color-surface-muted),#fff,var(--color-surface-muted))] bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}
