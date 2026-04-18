import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata";
import { getCatalogProducts } from "@/services/products";
import type { Product } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  let products: Product[] = [];

  try {
    products = await getCatalogProducts();
  } catch {
    products = [];
  }

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: product.updatedAt || product.createdAt || undefined,
    })),
  ];
}
