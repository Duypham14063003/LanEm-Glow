import React from "react";

import { Badge } from "@/components/ui/badge";
import { TikTokEmbed } from "@/components/site/tiktok-embed";

interface ProductGalleryProps {
  name: string;
  imageUrl: string;
  galleryUrls: string[];
  tiktokUrl: string | null;
}

export function ProductGallery({ name, imageUrl, galleryUrls, tiktokUrl }: ProductGalleryProps) {
  const images = [imageUrl, ...galleryUrls].filter(Boolean);

  return (
    <div className="space-y-4">
      {tiktokUrl ? (
        <div className="overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">Video review TikTok</p>
              <p className="text-xs text-[var(--color-foreground-soft)]">
                Xem nhanh texture, cảm giác thoa và cách dùng trước khi lướt ảnh.
              </p>
            </div>
            <Badge variant="info">Media đầu tiên</Badge>
          </div>
          <TikTokEmbed url={tiktokUrl} title={`${name} TikTok review`} />
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[var(--radius-sheet)] border border-[var(--color-border)] bg-[linear-gradient(135deg,#fff,#fbe4ea)] shadow-[var(--shadow-card)]">
        {images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt={name} className="aspect-square w-full object-cover" />
        ) : (
          <div className="aspect-square" />
        )}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-3">
          {images.slice(1, 4).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[linear-gradient(135deg,#fff,#fff1f4)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
