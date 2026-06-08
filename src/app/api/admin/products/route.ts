import { NextRequest, NextResponse } from "next/server";

import {
  createAdminProductHandler,
  listAdminProductsHandler,
} from "@/app/api/admin/products/handlers";
import {
  parseProductAdminQuery,
  ProductAdminError,
} from "@/services/admin-products";
import type {
  OrderErrorResponse,
  ProductAdminListResponse,
  ProductAdminMutationResponse,
} from "@/types";

export async function GET(request: NextRequest) {
  try {
    const query = parseProductAdminQuery({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      name: request.nextUrl.searchParams.get("name") ?? undefined,
      category: request.nextUrl.searchParams.get("category") ?? undefined,
      concern: request.nextUrl.searchParams.get("concern") ?? undefined,
      status: request.nextUrl.searchParams.get("status") ?? undefined,
      brand: request.nextUrl.searchParams.get("brand") ?? undefined,
    });
    const items = await listAdminProductsHandler(query);
    const response: ProductAdminListResponse = {
      items,
      total: items.length,
      query,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ProductAdminError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể tải danh sách sản phẩm.",
      code: "PRODUCT_LIST_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Nội dung yêu cầu không phải JSON hợp lệ.",
        code: "INVALID_JSON",
      } satisfies OrderErrorResponse,
      { status: 400 }
    );
  }

  try {
    const product = await createAdminProductHandler(payload);
    const response: ProductAdminMutationResponse = { product };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ProductAdminError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể tạo sản phẩm.",
      code: "PRODUCT_CREATE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
