import { NextResponse } from "next/server";

import { createAdminOrderHandler } from "@/app/api/admin/orders/handlers";
import { OrderAdminError, OrderSubmissionError } from "@/services/orders";
import type { OrderAdminCreateResponse, OrderErrorResponse } from "@/types";

export async function POST(request: Request) {
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
    const order = await createAdminOrderHandler(payload);
    const response: OrderAdminCreateResponse = { order };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof OrderSubmissionError || error instanceof OrderAdminError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể tạo đơn hàng từ admin.",
      code: "ADMIN_ORDER_CREATE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
