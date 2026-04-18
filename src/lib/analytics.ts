export type AnalyticsEventName =
  | "catalog_viewed"
  | "catalog_filtered"
  | "product_viewed"
  | "product_selected"
  | "quick_order_opened"
  | "quick_order_submitted"
  | "quick_order_submission_failed"
  | "admin_order_updated";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const event = {
    event: name,
    ...payload,
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(event);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics:event]", event);
  }
}
