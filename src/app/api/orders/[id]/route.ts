import { NextRequest, NextResponse } from "next/server";

import { getUpdateAdminOrderHandler } from "@/app/api/orders/[id]/handlers";
import { OrderAdminError } from "@/services/orders";
import type { OrderAdminUpdateResponse, OrderErrorResponse } from "@/types";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    const response: OrderErrorResponse = {
      error: "Nội dung yêu cầu không phải JSON hợp lệ.",
      code: "INVALID_JSON",
    };

    return NextResponse.json(response, { status: 400 });
  }

  try {
    const order = await getUpdateAdminOrderHandler()(id, payload);
    const response: OrderAdminUpdateResponse = { order };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof OrderAdminError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể cập nhật đơn hàng.",
      code: "ORDER_UPDATE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
