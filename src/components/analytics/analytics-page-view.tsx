"use client";

import { useEffect } from "react";

import type { AnalyticsEventName, AnalyticsPayload } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsPageView({
  event,
  payload,
}: {
  event: AnalyticsEventName;
  payload?: AnalyticsPayload;
}) {
  useEffect(() => {
    trackEvent(event, payload);
  }, [event, payload]);

  return null;
}
