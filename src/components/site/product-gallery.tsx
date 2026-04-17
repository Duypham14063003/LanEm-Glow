interface ProductGalleryProps {
  name: string;
  imageUrl: string;
  galleryUrls: string[];
}

export function ProductGallery({ name, imageUrl, galleryUrls }: ProductGalleryProps) {
  const images = [imageUrl, ...galleryUrls].filter(Boolean);

  return (
    <div className="space-y-4">
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
