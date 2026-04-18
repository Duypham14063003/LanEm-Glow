import { NextResponse } from "next/server";

import {
  getAdminSettingsHandler,
  updateAdminSettingsHandler,
} from "@/app/api/admin/settings/handlers";
import { SettingsAdminError } from "@/services/settings";
import type { AdminSettingsResponse, OrderErrorResponse } from "@/types";

export async function GET() {
  try {
    const settings = await getAdminSettingsHandler();
    const response: AdminSettingsResponse = { settings };

    return NextResponse.json(response);
  } catch (error) {
    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể tải cài đặt admin.",
      code: "ADMIN_SETTINGS_READ_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
    const settings = await updateAdminSettingsHandler(payload);
    const response: AdminSettingsResponse = { settings };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof SettingsAdminError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể cập nhật cài đặt admin.",
      code: "ADMIN_SETTINGS_WRITE_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
