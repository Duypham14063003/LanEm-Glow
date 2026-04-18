import assert from "node:assert/strict";
import test from "node:test";

import {
  ProductImageUploadError,
  uploadAdminProductImage,
} from "@/services/admin-product-image-upload";

function createUploadableFile(
  content: Uint8Array,
  options: { name: string; type: string }
) {
  return {
    name: options.name,
    size: content.length,
    type: options.type,
    arrayBuffer: async () => {
      const bytes = Uint8Array.from(content);
      return bytes.buffer as ArrayBuffer;
    },
  };
}

test("uploadAdminProductImage rejects unsupported file types", async () => {
  const file = createUploadableFile(new Uint8Array([104, 101, 108, 108, 111]), {
    name: "note.txt",
    type: "text/plain",
  });

  await assert.rejects(() => uploadAdminProductImage(file), ProductImageUploadError);
});

test("uploadAdminProductImage rejects oversized files", async () => {
  const bytes = new Uint8Array(5 * 1024 * 1024 + 1);
  const file = createUploadableFile(bytes, {
    name: "big.png",
    type: "image/png",
  });

  await assert.rejects(() => uploadAdminProductImage(file), /5MB/);
});

test("uploadAdminProductImage writes file and returns public URL", async () => {
  const writes: Array<{ filePath: string; size: number }> = [];
  const file = createUploadableFile(new Uint8Array([1, 2, 3]), {
    name: "serum.png",
    type: "image/png",
  });

  const result = await uploadAdminProductImage(file, {
    ensureDirectory: async () => {},
    now: () => new Date("2026-04-19T09:00:00.000Z"),
    randomSuffix: () => "fixed1234",
    writeFile: async (filePath, content) => {
      writes.push({ filePath, size: content.length });
    },
  });

  assert.equal(result.fileName, "1776589200000-fixed1234.png");
  assert.equal(result.url, "/uploads/products/1776589200000-fixed1234.png");
  assert.equal(writes.length, 1);
  assert.equal(writes[0]?.size, 3);
});
