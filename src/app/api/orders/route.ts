import { NextRequest, NextResponse } from "next/server";

import { OrderSubmissionError, submitQuickOrder } from "@/services/orders";
import type { OrderErrorResponse, OrderSubmissionResult } from "@/types";

let submitQuickOrderHandler = submitQuickOrder;

export function setSubmitQuickOrderHandlerForTesting(handler: typeof submitQuickOrder) {
  submitQuickOrderHandler = handler;
}

export function resetSubmitQuickOrderHandlerForTesting() {
  submitQuickOrderHandler = submitQuickOrder;
}

export async function POST(request: NextRequest) {
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
    const result: OrderSubmissionResult = await submitQuickOrderHandler(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof OrderSubmissionError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể ghi nhận yêu cầu đặt hàng.",
      code: "ORDER_WRITE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
