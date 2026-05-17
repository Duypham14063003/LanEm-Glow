import type { Metadata } from "next";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  // Strip surrounding quotes that may be present in some CI/CD environments
  const cleaned = raw.trim().replace(/^["']|["']$/g, "");
  return trimTrailingSlash(cleaned || "http://localhost:3000");
}

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildMetadata({ title, description, path = "/", image }: MetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;
  const imageUrl = image || `${siteUrl}/og-default.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "LanEm Glow",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildProductMetadata(input: {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
}): Metadata {
  return buildMetadata({
    title: `${input.name} | LanEm Glow`,
    description: input.description,
    path: `/products/${input.slug}`,
    image: input.imageUrl || undefined,
  });
}
