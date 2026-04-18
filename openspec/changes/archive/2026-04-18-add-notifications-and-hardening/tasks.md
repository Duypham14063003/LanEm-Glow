# Tasks

## 1. Notification Contracts And Configuration

- [x] Add notification types and delivery result contracts where needed.
- [x] Define SMTP/admin notification configuration guards using existing env patterns.
- [x] Document best-effort notification behavior in code-level contracts.

## 2. Notification Service

- [x] Add a notification service that can build and send new-order emails.
- [x] Skip cleanly when notification configuration is missing or disabled.
- [x] Surface controlled notification failures without breaking valid order creation.

## 3. Order Write Integration And Error Handling

- [x] Integrate notification triggering into the successful quick-order write path.
- [x] Extend order-related responses to communicate degraded-but-successful outcomes when appropriate.
- [x] Normalize error handling for core order APIs.

## 4. Rate Limiting

- [x] Add a rate-limiting helper for public order submissions.
- [x] Apply rate limiting to `POST /api/orders`.
- [x] Return a clear `429` response for rate-limited requests.

## 5. UI State Hardening

- [x] Improve quick-order UI messaging for rate-limited and degraded-success outcomes.
- [x] Add missing loading, empty, or failure states in the admin orders workflow where currently sparse.
- [x] Add lightweight system feedback support for short-lived success and failure messages if needed.

## 6. Verification

- [x] Add tests for notification service behavior and rate limiting behavior.
- [x] Add tests for order API outcomes covering success, degraded success, and `429` responses.
- [x] Verify lint, type-check, and test suite pass.
