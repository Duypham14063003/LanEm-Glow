import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PRODUCT_UPLOAD_DIRECTORY = path.join(process.cwd(), "public", "uploads", "products");
const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

type UploadDependencies = {
  ensureDirectory: (dir: string) => Promise<void>;
  now: () => Date;
  randomSuffix: () => string;
  writeFile: (filePath: string, content: Uint8Array) => Promise<void>;
};

export type UploadableImageFile = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  name: string;
  size: number;
  type: string;
};

const defaultDependencies: UploadDependencies = {
  ensureDirectory: async (dir) => {
    await mkdir(dir, { recursive: true });
  },
  now: () => new Date(),
  randomSuffix: () => Math.random().toString(36).slice(2, 10),
  writeFile: async (filePath, content) => {
    await writeFile(filePath, content);
  },
};

export class ProductImageUploadError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message);
    this.name = "ProductImageUploadError";
    this.statusCode = options?.statusCode ?? 400;
    this.code = options?.code ?? "PRODUCT_IMAGE_UPLOAD_FAILED";
  }
}

function getExtension(file: UploadableImageFile): string {
  const mimeExtension = ALLOWED_IMAGE_TYPES.get(file.type);
  if (mimeExtension) {
    return mimeExtension;
  }

  const originalExtension = path.extname(file.name || "").toLowerCase();
  const extension = [...ALLOWED_IMAGE_TYPES.values()].find((item) => item === originalExtension);
  if (extension) {
    return extension;
  }

  throw new ProductImageUploadError("Định dạng ảnh chưa được hỗ trợ.", {
    statusCode: 415,
    code: "UNSUPPORTED_IMAGE_TYPE",
  });
}

function assertValidFile(file: UploadableImageFile | null): UploadableImageFile {
  if (!file) {
    throw new ProductImageUploadError("Bạn chưa chọn file ảnh để tải lên.", {
      statusCode: 400,
      code: "MISSING_IMAGE_FILE",
    });
  }

  if (file.size <= 0) {
    throw new ProductImageUploadError("File ảnh không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_IMAGE_FILE",
    });
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new ProductImageUploadError("Ảnh vượt quá dung lượng cho phép 5MB.", {
      statusCode: 413,
      code: "IMAGE_FILE_TOO_LARGE",
    });
  }

  if (!file.type.startsWith("image/")) {
    throw new ProductImageUploadError("Chỉ chấp nhận file ảnh.", {
      statusCode: 415,
      code: "UNSUPPORTED_IMAGE_TYPE",
    });
  }

  return file;
}

export async function uploadAdminProductImage(
  input: UploadableImageFile | null,
  dependencies: UploadDependencies = defaultDependencies
) {
  const file = assertValidFile(input);
  const extension = getExtension(file);
  const filename = `${dependencies.now().getTime()}-${dependencies.randomSuffix()}${extension}`;
  const filePath = path.join(PRODUCT_UPLOAD_DIRECTORY, filename);
  const buffer = new Uint8Array(await file.arrayBuffer());

  try {
    await dependencies.ensureDirectory(PRODUCT_UPLOAD_DIRECTORY);
    await dependencies.writeFile(filePath, buffer);
  } catch {
    throw new ProductImageUploadError("Không thể lưu file ảnh trên máy chủ.", {
      statusCode: 500,
      code: "IMAGE_WRITE_FAILED",
    });
  }

  return {
    fileName: filename,
    url: `/uploads/products/${filename}`,
  };
}
