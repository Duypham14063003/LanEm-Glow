import { updateAdminOrder } from "@/services/orders";

let updateAdminOrderHandler = updateAdminOrder;

export function getUpdateAdminOrderHandler() {
  return updateAdminOrderHandler;
}

export function setUpdateAdminOrderHandlerForTesting(handler: typeof updateAdminOrder) {
  updateAdminOrderHandler = handler;
}

export function resetUpdateAdminOrderHandlerForTesting() {
  updateAdminOrderHandler = updateAdminOrder;
}
