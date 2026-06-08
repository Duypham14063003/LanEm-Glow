"use client";

import React, { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PlayCircle,
  X,
} from "lucide-react";

import { TikTokEmbed } from "@/components/site/tiktok-embed";
import { Badge } from "@/components/ui/badge";
import { buildTikTokEmbedUrl } from "@/lib/tiktok";
import { appendVersionToUrl, cn } from "@/lib/utils";

interface ProductGalleryProps {
  name: string;
  imageUrl: string;
  galleryUrls: string[];
  tiktokUrl: string | null;
  updatedAt?: string | null;
}

type MediaItem =
  | {
      type: "video";
      id: string;
      label: string;
      url: string;
      embeddable: boolean;
    }
  | { type: "image"; id: string; label: string; url: string };

function buildMediaItems(
  name: string,
  imageUrl: string,
  galleryUrls: string[],
  tiktokUrl: string | null,
  updatedAt: string | null | undefined,
): MediaItem[] {
  const items: MediaItem[] = [];

  if (tiktokUrl) {
    items.push({
      type: "video",
      id: "video",
      label: `Video review ${name}`,
      url: tiktokUrl,
      embeddable: Boolean(buildTikTokEmbedUrl(tiktokUrl)),
    });
  }

  [imageUrl, ...galleryUrls].filter(Boolean).forEach((url, index) => {
    items.push({
      type: "image",
      id: `image-${index}`,
      label: index === 0 ? `${name} image chính` : `${name} image ${index + 1}`,
      url: appendVersionToUrl(url, updatedAt),
    });
  });

  return items;
}

export function ProductGallery({
  name,
  imageUrl,
  galleryUrls,
  tiktokUrl,
  updatedAt,
}: ProductGalleryProps) {
  const mediaItems = useMemo(
    () => buildMediaItems(name, imageUrl, galleryUrls, tiktokUrl, updatedAt),
    [galleryUrls, imageUrl, name, tiktokUrl, updatedAt],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeItem = mediaItems[activeIndex] ?? null;

  const goToIndex = (index: number) => {
    if (index < 0 || index >= mediaItems.length) {
      return;
    }

    setActiveIndex(index);
  };

  const goPrevious = () => {
    if (mediaItems.length === 0) {
      return;
    }

    setActiveIndex(
      (current) => (current - 1 + mediaItems.length) % mediaItems.length,
    );
  };

  const goNext = () => {
    if (mediaItems.length === 0) {
      return;
    }

    setActiveIndex((current) => (current + 1) % mediaItems.length);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX;
    const endX = event.changedTouches[0]?.clientX ?? null;
    setTouchStartX(null);

    if (startX === null || endX === null) {
      return;
    }

    const distance = startX - endX;

    if (Math.abs(distance) < 40) {
      return;
    }

    if (distance > 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
            {/* <div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                {activeItem?.type === "video" ? "Video review TikTok" : "Thư viện sản phẩm"}
              </p>
              <p className="text-xs text-[var(--color-foreground-soft)]">
                Lướt trái phải để xem video và các ảnh khác như một gallery sản phẩm thống nhất.
              </p>
            </div> */}
            <Badge variant="info">
              {mediaItems.length === 0
                ? "0 / 0"
                : `${activeIndex + 1} / ${mediaItems.length}`}
            </Badge>
          </div>

          <div className="relative">
            {activeItem?.type === "video" ? (
              <button
                type="button"
                className="group relative block aspect-square w-full overflow-hidden bg-[radial-gradient(circle_at_top,#fff_0%,#fbe4ea_60%,#fff1f4_100%)] text-left"
                onClick={() => setIsVideoOpen(true)}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(67,52,58,0.12))]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="flex size-20 items-center justify-center rounded-full bg-white/92 shadow-[var(--shadow-soft)] transition duration-200 group-hover:scale-[1.03]">
                    <PlayCircle
                      className="size-11 text-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Video review
                    </p>
                    <p className="text-2xl font-semibold text-[var(--color-foreground)]">
                      Chạm để xem video TikTok
                    </p>
                    <p className="mx-auto max-w-md text-sm text-[var(--color-foreground-soft)]">
                      Video được mở trong lớp xem riêng để phần gallery vẫn giữ
                      trải nghiệm lướt ảnh mượt như các sàn thương mại điện tử.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--color-accent)]">
                    <PlayCircle className="size-4" aria-hidden="true" />
                    Mở video review
                  </div>
                </div>
              </button>
            ) : activeItem?.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeItem.url}
                alt={activeItem.label}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="aspect-square w-full bg-[var(--color-surface-muted)]" />
            )}

            {mediaItems.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Media trước"
                  className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-foreground)] shadow-[var(--shadow-soft)] transition hover:scale-[1.02]"
                  onClick={goPrevious}
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Media tiếp"
                  className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-foreground)] shadow-[var(--shadow-soft)] transition hover:scale-[1.02]"
                  onClick={goNext}
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {mediaItems.length > 1 ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {mediaItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToIndex(index)}
                className={cn(
                  "relative overflow-hidden rounded-[var(--radius-card)] border bg-white text-left transition duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                  activeIndex === index
                    ? "border-[var(--color-accent)] ring-2 ring-[color:color-mix(in_srgb,var(--color-accent)_20%,white)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]",
                )}
              >
                {item.type === "video" ? (
                  <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#fff,#fbe4ea)] p-3 text-center">
                    <PlayCircle
                      className="size-8 text-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-[var(--color-foreground)]">
                      Video
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.label}
                    className="aspect-square w-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isVideoOpen && tiktokUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(67,52,58,0.5)] p-4 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Đóng video review"
            className="absolute inset-0"
            onClick={() => setIsVideoOpen(false)}
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-white shadow-[0_24px_80px_rgba(67,52,58,0.24)]">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Video review
                </p>
                <p className="mt-1 text-xl font-semibold text-[var(--color-foreground)]">
                  {name}
                </p>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setIsVideoOpen(false)}
                className="rounded-full border border-[var(--color-border)] p-2 text-[var(--color-foreground-soft)] transition hover:bg-[var(--color-surface-muted)]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <TikTokEmbed
                url={tiktokUrl}
                title={`${name} TikTok review`}
                showExternalLink={false}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[var(--color-foreground-soft)]">
                  Nếu player TikTok không tải được trong web, bạn vẫn có thể mở
                  trực tiếp bằng nút bên cạnh.
                </p>
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition hover:opacity-85"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Xem trên TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
