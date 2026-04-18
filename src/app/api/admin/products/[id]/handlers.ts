import { archiveAdminProduct, updateAdminProduct } from "@/services/admin-products";

export let updateAdminProductHandler = updateAdminProduct;
export let archiveAdminProductHandler = archiveAdminProduct;

export function setUpdateAdminProductHandlerForTesting(handler: typeof updateAdminProduct) {
  updateAdminProductHandler = handler;
}

export function resetUpdateAdminProductHandlerForTesting() {
  updateAdminProductHandler = updateAdminProduct;
}

export function setArchiveAdminProductHandlerForTesting(handler: typeof archiveAdminProduct) {
  archiveAdminProductHandler = handler;
}

export function resetArchiveAdminProductHandlerForTesting() {
  archiveAdminProductHandler = archiveAdminProduct;
}
