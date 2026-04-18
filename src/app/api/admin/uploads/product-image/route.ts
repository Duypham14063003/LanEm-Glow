import { NextResponse } from "next/server";

import { uploadAdminProductImageHandler } from "@/app/api/admin/uploads/product-image/handlers";
import {
  ProductImageUploadError,
  type UploadableImageFile,
} from "@/services/admin-product-image-upload";
import type { OrderErrorResponse } from "@/types";

export const runtime = "nodejs";

function isUploadableImageFile(value: unknown): value is UploadableImageFile {
  return (
    !!value &&
    typeof value === "object" &&
    "arrayBuffer" in value &&
    typeof value.arrayBuffer === "function" &&
    "name" in value &&
    typeof value.name === "string" &&
    "size" in value &&
    typeof value.size === "number" &&
    "type" in value &&
    typeof value.type === "string"
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const candidate = formData.get("file");
    const file = isUploadableImageFile(candidate) ? candidate : null;
    const result = await uploadAdminProductImageHandler(file);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ProductImageUploadError) {
      const response: OrderErrorResponse = {
        error: error.message,
        code: error.code,
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    const response: OrderErrorResponse = {
      error: error instanceof Error ? error.message : "Không thể tải ảnh lên.",
      code: "PRODUCT_IMAGE_UPLOAD_FAILED",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
