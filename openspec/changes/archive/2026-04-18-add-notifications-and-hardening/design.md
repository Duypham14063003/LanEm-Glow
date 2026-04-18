# Design: Add Notifications And Hardening

## Overview

This change adds the operational reliability layer needed between feature completeness and launch polish. The main targets are:

- delivery awareness for new orders
- resilience under failure conditions
- safer public order intake
- more consistent state feedback in the UI

The design should preserve the existing project shape: thin route handlers, service-layer business logic, and UI components that respond to normalized backend outcomes.

## Product Scope

Included:

- SMTP email notification for new orders
- best-effort notification delivery after order creation
- rate limiting for order creation
- improved loading, empty, and error states
- more consistent error mapping for order-related flows

Excluded:

- settings management UI for notification configuration
- launch SEO work
- analytics instrumentation
- non-email notification channels

## Architecture Sketch

```txt
Quick order submit
      │
      ▼
POST /api/orders
      │
      ├── rate limiter
      │       └── reject abusive bursts
      │
      ├── orders service
      │       └── validate + duplicate check + sheet append
      │
      └── notifications service
              ├── build order email payload
              ├── SMTP send
              └── return delivery result
```

## Key Decisions

### 1. Notification Delivery Must Be Best Effort

Order creation is the primary conversion event. If the order row is successfully written, the API should not downgrade that success into a total failure just because SMTP delivery failed.

Recommended behavior:

- order append succeeds
- notification send runs after persistence
- API still returns success if notification fails
- failure is surfaced through logs and, optionally, a warning field in the response

### 2. Rate Limiting Should Start Narrow

The first rate limiter should protect only `POST /api/orders`. This is the only public write endpoint and the highest abuse risk.

An in-memory limiter is acceptable for MVP because the project already operates in a lightweight architecture and does not yet require distributed coordination.

### 3. Notification Settings Stay Env-Driven In Milestone 7

The spec mentions admin-side settings such as notification enablement and duplicate thresholds, but milestone 7 should avoid reopening the full settings module.

For this phase:

- read notification configuration from env
- expose any needed public/admin indicators later
- keep the actual settings UI out of scope

### 4. Error Mapping Should Be Intentional

Core order APIs should distinguish:

- invalid request
- rate limited request
- operational service failure
- notification degradation after successful write

This gives the UI enough signal to show useful messaging instead of generic errors.

### 5. Missing State Coverage Should Be Filled Selectively

The app already has some loading and empty states. Milestone 7 should cover the obvious gaps rather than redesign every page:

- admin orders list loading and failure handling
- admin order update save feedback
- quick-order failure messaging polish
- route-level empty/failure fallbacks where currently inconsistent

## Expected Modules

```txt
src/
├── lib/
│   ├── notifications.ts
│   └── rate-limit.ts
├── services/orders.ts
├── app/api/orders/route.ts
├── app/api/orders/[id]/route.ts
├── components/ui/toast.tsx or equivalent lightweight feedback layer
└── admin/site UI surfaces that currently need stronger state coverage
```

## Notification Flow

### Trigger

Notification should fire after a successful quick-order write.

### Payload

Suggested email content includes:

- order id
- created timestamp
- phone
- customer name
- selected product names
- item count
- customer note
- duplicate classification
- source page and campaign

### Delivery Rules

- if notification config is missing, skip send cleanly
- if delivery fails, do not roll back the order
- return a controlled degraded outcome internally

## Rate Limit Strategy

### Scope

Apply only to `POST /api/orders`.

### Key

Use request IP or forwarded IP as the first limiter key. If unavailable, fall back to a generic bucket.

### Behavior

Suggested MVP behavior:

- allow a small burst window
- return `429` with a clear error message when exceeded

## UI Hardening Areas

### Quick Order

- preserve current loading behavior
- show a distinct message for rate limiting
- optionally surface a soft warning if notification delivery failed but order was recorded

### Admin Orders

- add stronger loading and empty handling
- make order update success/failure feedback consistent
- ensure the detail panel does not silently reset on update errors

## Risks

### SMTP configuration variability

SMTP can fail for many reasons: missing env, auth problems, provider limits. The notification service should isolate those failures from the main order write path.

### In-memory rate limiting limitations

An in-memory limiter will not be shared across server instances. That is acceptable for MVP but should be documented as a limitation.

### Scope creep into launch work

SEO, analytics, and mobile polish belong to milestone 8. This change should stay operationally focused.

## Assumptions

- Email delivery is sufficient as the first notification channel.
- The project can accept in-memory rate limiting for MVP.
- Existing UI foundation can support additional state feedback without a large component refactor.
