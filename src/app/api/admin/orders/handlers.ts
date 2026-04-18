import { createAdminOrder } from "@/services/orders";

export let createAdminOrderHandler = createAdminOrder;

export function setCreateAdminOrderHandlerForTesting(handler: typeof createAdminOrder) {
  createAdminOrderHandler = handler;
}

export function resetCreateAdminOrderHandlerForTesting() {
  createAdminOrderHandler = createAdminOrder;
}
