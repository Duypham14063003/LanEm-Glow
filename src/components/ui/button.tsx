import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-strong)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-foreground)] ring-1 ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]",
  ghost:
    "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]",
  danger:
    "bg-[var(--color-danger)] text-white shadow-[var(--shadow-soft)] hover:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-page)]",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;

      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden="true"
            />
            <span>Đang tải</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
