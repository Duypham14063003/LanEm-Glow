import { NextRequest, NextResponse } from "next/server";

import { listCatalogProducts } from "@/services/products";
import type { CatalogListResponse, ProductCatalogQuery } from "@/types";

function parseBooleanQuery(value: string | null): boolean | undefined {
  if (value === null) {
    return undefined;
  }

  return value.toLowerCase() === "true";
}

function parseProductsQuery(request: NextRequest): ProductCatalogQuery {
  const { searchParams } = request.nextUrl;

  return {
    q: searchParams.get("q")?.trim() || undefined,
    category: searchParams.get("category")?.trim() || undefined,
    brand: searchParams.get("brand")?.trim() || undefined,
    concern: searchParams.get("concern")?.trim() || undefined,
    featured: parseBooleanQuery(searchParams.get("featured")),
    stockStatus: (searchParams.get("stockStatus")?.trim() as ProductCatalogQuery["stockStatus"]) ||
      undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const query = parseProductsQuery(request);
    const items = await listCatalogProducts(query);
    const response: CatalogListResponse = {
      items,
      total: items.length,
      query,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load catalog products.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
