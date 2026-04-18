import { uploadAdminProductImage } from "@/services/admin-product-image-upload";

export let uploadAdminProductImageHandler = uploadAdminProductImage;

export function setUploadAdminProductImageHandlerForTesting(
  handler: typeof uploadAdminProductImage
) {
  uploadAdminProductImageHandler = handler;
}

export function resetUploadAdminProductImageHandlerForTesting() {
  uploadAdminProductImageHandler = uploadAdminProductImage;
}
