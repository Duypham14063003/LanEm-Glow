import { createAdminProduct, listAdminProducts } from "@/services/admin-products";

export let listAdminProductsHandler = listAdminProducts;
export let createAdminProductHandler = createAdminProduct;

export function setListAdminProductsHandlerForTesting(handler: typeof listAdminProducts) {
  listAdminProductsHandler = handler;
}

export function resetListAdminProductsHandlerForTesting() {
  listAdminProductsHandler = listAdminProducts;
}

export function setCreateAdminProductHandlerForTesting(handler: typeof createAdminProduct) {
  createAdminProductHandler = handler;
}

export function resetCreateAdminProductHandlerForTesting() {
  createAdminProductHandler = createAdminProduct;
}
