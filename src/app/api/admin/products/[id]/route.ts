import { NextResponse } from "next/server";

import {
  archiveAdminProductHandler,
  updateAdminProductHandler,
} from "@/app/api/admin/products/[id]/handlers";
import { ProductAdminError } from "@/services/admin-products";
import type {
  OrderErrorResponse,
  ProductAdminArchiveResponse,
  ProductAdminMutationResponse,
} from "@/types";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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
    const { id } = await context.params;
    const product = await updateAdminProductHandler(id, payload);
    const response: ProductAdminMutationResponse = { product };

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
      error: error instanceof Error ? error.message : "Không thể cập nhật sản phẩm.",
      code: "PRODUCT_UPDATE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await archiveAdminProductHandler(id);
    const response: ProductAdminArchiveResponse = { product };

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
      error: error instanceof Error ? error.message : "Không thể lưu trạng thái sản phẩm.",
      code: "PRODUCT_ARCHIVE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
