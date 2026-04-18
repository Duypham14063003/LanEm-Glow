# Add Notifications And Hardening

## Why

The product now has a functional storefront, quick-order write flow, and admin order operations, but the system still lacks the operational hardening needed for launch readiness.

Milestone 7 should make the project more resilient and trustworthy by adding admin notifications for new orders, improving failure handling, filling missing loading and empty states, and protecting the public order endpoint from abuse.

## What Changes

- Add email notification delivery for newly created orders using the configured SMTP environment variables.
- Introduce a notification service layer that can fail gracefully without breaking successful order creation.
- Add rate limiting to `POST /api/orders` to reduce abuse and accidental rapid re-submission.
- Improve API and UI error handling for the quick-order and admin orders workflows.
- Add missing loading, empty, and failure states where the current experience is still sparse or inconsistent.
- Prepare admin settings integration points for notification toggles and duplicate-window visibility without requiring full settings management UI yet.

## Non-Goals

- Analytics or product launch instrumentation
- SEO assets such as sitemap or robots
- Full admin settings editor
- Slack or Telegram notification implementations
- Authentication or authorization work

## Scope Notes

This change focuses on operational resilience rather than new product surfaces. The system should behave well under expected failure modes, provide timely notification to operators, and avoid avoidable abuse on the public order endpoint.

Notification sending should be treated as best effort. A successful order write must remain successful even if email delivery fails.

## Success Criteria

- New quick orders trigger an email notification to the configured admin recipient.
- Notification failures are captured as controlled errors or warnings without losing valid orders.
- `POST /api/orders` is rate limited with a clear user-facing error response when limits are hit.
- Quick-order and admin flows show clearer loading, empty, and failure states.
- Error handling is more consistent across the core order-related APIs and UI surfaces.
