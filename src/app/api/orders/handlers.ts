import { consumeRateLimit } from "@/lib/rate-limit";
import { listAdminOrders, submitQuickOrder } from "@/services/orders";

let submitQuickOrderHandler = submitQuickOrder;
let listAdminOrdersHandler = listAdminOrders;
let consumeRateLimitHandler = consumeRateLimit;

export function getSubmitQuickOrderHandler() {
  return submitQuickOrderHandler;
}

export function setSubmitQuickOrderHandlerForTesting(handler: typeof submitQuickOrder) {
  submitQuickOrderHandler = handler;
}

export function resetSubmitQuickOrderHandlerForTesting() {
  submitQuickOrderHandler = submitQuickOrder;
}

export function getListAdminOrdersHandler() {
  return listAdminOrdersHandler;
}

export function setListAdminOrdersHandlerForTesting(handler: typeof listAdminOrders) {
  listAdminOrdersHandler = handler;
}

export function resetListAdminOrdersHandlerForTesting() {
  listAdminOrdersHandler = listAdminOrders;
}

export function getConsumeRateLimitHandler() {
  return consumeRateLimitHandler;
}

export function setConsumeRateLimitHandlerForTesting(handler: typeof consumeRateLimit) {
  consumeRateLimitHandler = handler;
}

export function resetConsumeRateLimitHandlerForTesting() {
  consumeRateLimitHandler = consumeRateLimit;
}
