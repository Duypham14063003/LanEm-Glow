import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  title: string;
  description: string;
}

export function AdminTopbar({ title, description }: AdminTopbarProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[color:color-mix(in_srgb,white_82%,var(--color-page))] px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Internal workspace
          </p>
          <h1 className="mt-1 text-3xl text-[var(--color-foreground)]">{title}</h1>
          <p className="mt-1 text-sm text-[var(--color-foreground-soft)]">{description}</p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <a href="">
            <RefreshCcw className="size-4" aria-hidden="true" />
            Làm mới
          </a>
        </Button>
      </div>
    </div>
  );
}
