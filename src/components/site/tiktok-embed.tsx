import React from "react";
import { ExternalLink, PlayCircle } from "lucide-react";

import { buildTikTokEmbedUrl } from "@/lib/tiktok";

interface TikTokEmbedProps {
  url: string;
  title: string;
  compact?: boolean;
  showExternalLink?: boolean;
}

export function TikTokEmbed({
  url,
  title,
  compact = false,
  showExternalLink = true,
}: TikTokEmbedProps) {
  const embedUrl = buildTikTokEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(251,228,234,0.95))] p-5 text-center">
        <PlayCircle className="size-10 text-[var(--color-accent)]" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Video TikTok</p>
          <p className="text-xs text-[var(--color-foreground-soft)]">
            Video này sẽ mở qua TikTok vì chưa có dạng embed trực tiếp.
          </p>
        </div>
        {showExternalLink ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition hover:opacity-85"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Mở video
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-52 bg-[#fff8f9]">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full min-h-52 w-full border-0"
        allow="encrypted-media"
        loading="lazy"
        allowFullScreen
      />
      {showExternalLink ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={[
            "absolute right-3 z-10 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-medium text-[var(--color-foreground)] shadow-[var(--shadow-soft)] backdrop-blur",
            compact ? "bottom-3" : "bottom-4",
          ].join(" ")}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          Xem trên TikTok
        </a>
      ) : null}
    </div>
  );
}
