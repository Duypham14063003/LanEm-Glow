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
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Đóng quick order"
        className="absolute inset-0 bg-[rgba(67,52,58,0.36)] backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 mx-auto w-full max-w-2xl rounded-t-[var(--radius-sheet)] border border-[var(--color-border)] bg-white px-5 pb-6 pt-4 shadow-[0_-24px_60px_rgba(67,52,58,0.18)] transition duration-[var(--motion-base)] ease-[var(--ease-standard)]",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[var(--color-border)]" />
        <div className="mb-5 flex items-start justify-between gap-4">
          {title ? (
            <div>
              <p className="font-heading text-3xl text-[var(--color-foreground)]">{title}</p>
            </div>
          ) : (
            <div />
          )}
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-[var(--color-border)] p-2 text-[var(--color-foreground-soft)] transition hover:bg-[var(--color-surface-muted)]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
