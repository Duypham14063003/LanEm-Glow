import { NextResponse } from "next/server";

import { getCatalogProductBySlug } from "@/services/products";
import type { ProductDetailResponse } from "@/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await getCatalogProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const response: ProductDetailResponse = { product };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load product detail.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
