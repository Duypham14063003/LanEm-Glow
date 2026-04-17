# Tasks

## 1. Order Types And Contracts

- [x] Add order payload, result, and status types.
- [x] Define typed server-side request/response contracts for quick-order submission.
- [x] Add any order-row snapshot types needed for Sheets writes.

## 2. Validation And Normalization

- [x] Add server-side phone normalization and validation helpers.
- [x] Validate selected product ids and required order fields on the backend.
- [x] Add request guards for invalid or empty quick-order submissions.

## 3. Sheets Write Support

- [x] Extend the Google Sheets helper to support appending rows to the `orders` sheet.
- [x] Preserve consistent column ordering for the `orders` tab schema.
- [x] Ensure write failures surface as controlled backend errors.

## 4. Orders Service

- [x] Add an order service that validates payloads, re-checks product state, and builds order records.
- [x] Implement duplicate detection using normalized phone + selected product id set + duplicate window.
- [x] Generate order ids and order timestamps.
- [x] Map duplicate vs. normal submissions into structured order outcomes.

## 5. Orders API

- [x] Implement `POST /api/orders`.
- [x] Return appropriate success/error responses for valid, invalid, and duplicate submissions.
- [x] Keep route-level logic thin and delegate business rules to the order service.

## 6. Quick Order UI Submission

- [x] Update the quick-order sheet to submit to the real orders API.
- [x] Show loading, success, and failure states from backend results.
- [x] Clear selected products only after successful submission.

## 7. Verification

- [x] Add tests for phone normalization and duplicate detection behavior.
- [x] Add tests for order API error/success handling.
- [x] Verify lint, type-check, and test suite pass.
