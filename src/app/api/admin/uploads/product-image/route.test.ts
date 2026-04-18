import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "@/app/api/admin/uploads/product-image/route";
import {
  resetUploadAdminProductImageHandlerForTesting,
  setUploadAdminProductImageHandlerForTesting,
} from "@/app/api/admin/uploads/product-image/handlers";
import { ProductImageUploadError } from "@/services/admin-product-image-upload";

function createUploadableFile() {
  return {
    name: "demo.png",
    size: 3,
    type: "image/png",
    arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
  };
}

test("POST /api/admin/uploads/product-image returns uploaded image payload", async () => {
  setUploadAdminProductImageHandlerForTesting(async () => ({
    fileName: "demo.png",
    url: "/uploads/products/demo.png",
  }));

  const response = await POST(
    {
      formData: async () => ({
        get: (key: string) => (key === "file" ? createUploadableFile() : null),
      }),
    } as unknown as Request
  );
  const payload = (await response.json()) as { url: string };

  assert.equal(response.status, 201);
  assert.equal(payload.url, "/uploads/products/demo.png");

  resetUploadAdminProductImageHandlerForTesting();
});

test("POST /api/admin/uploads/product-image maps upload validation errors", async () => {
  setUploadAdminProductImageHandlerForTesting(async () => {
    throw new ProductImageUploadError("Bạn chưa chọn file ảnh để tải lên.", {
      statusCode: 400,
      code: "MISSING_IMAGE_FILE",
    });
  });

  const response = await POST(
    {
      formData: async () => ({
        get: () => null,
      }),
    } as unknown as Request
  );
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "MISSING_IMAGE_FILE");

  resetUploadAdminProductImageHandlerForTesting();
});
