"use client";

import { useEffect, type ReactNode } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <button
        type="button"
        aria-label="Đóng quick order"
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[32px] border border-[var(--color-border)] bg-white p-6 shadow-2xl sm:p-8 animate-scale-in",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          {title ? (
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-foreground)]">{title}</h2>
            </div>
          ) : (
            <div />
          )}
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-gray-50/80 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary-strong)] p-2.5 text-[var(--color-foreground-soft)] transition-colors border border-[var(--color-border)] shadow-sm shrink-0"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
