import { NextRequest, NextResponse } from "next/server";

import { getRateLimitKey } from "@/lib/rate-limit";
import {
  OrderAdminError,
  OrderRateLimitError,
  OrderSubmissionError,
  parseOrderAdminQuery,
} from "@/services/orders";
import type {
  OrderAdminListResponse,
  OrderErrorResponse,
  OrderSubmissionResult,
} from "@/types";
import {
  getConsumeRateLimitHandler,
  getListAdminOrdersHandler,
  getSubmitQuickOrderHandler,
} from "@/app/api/orders/handlers";

export async function GET(request: NextRequest) {
  try {
    const query = parseOrderAdminQuery({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      status: request.nextUrl.searchParams.get("status") ?? undefined,
      duplicate: request.nextUrl.searchParams.get("duplicate") ?? undefined,
      dateFrom: request.nextUrl.searchParams.get("dateFrom") ?? undefined,
      dateTo: request.nextUrl.searchParams.get("dateTo") ?? undefined,
    });
    const items = await getListAdminOrdersHandler()(query);
    const response: OrderAdminListResponse = {
      items,
      total: items.length,
      query,
    };

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
      error: error instanceof Error ? error.message : "Không thể tải danh sách đơn hàng.",
      code: "ORDER_LIST_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = getConsumeRateLimitHandler()(getRateLimitKey(request.headers));

  if (!rateLimit.allowed) {
    const response: OrderErrorResponse = {
      error: "Bạn đang gửi yêu cầu quá nhanh. Vui lòng thử lại sau ít phút.",
      code: "ORDER_RATE_LIMITED",
    };

    return NextResponse.json(response, {
      status: 429,
      headers: {
        "x-ratelimit-reset": `${rateLimit.resetAt}`,
      },
    });
  }

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
    const result: OrderSubmissionResult = await getSubmitQuickOrderHandler()(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof OrderSubmissionError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    if (error instanceof OrderRateLimitError) {
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
