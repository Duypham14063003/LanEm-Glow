# Add Order Write Layer

## Why

The storefront now supports customer discovery and a client-side quick-order interaction flow, but order intent is not yet persisted anywhere. The current quick-order sheet only validates locally and shows a success-ready state without sending a real request or creating an order record.

Milestone 5 is the first true write-side backend slice of the project. It must turn quick-order input into a stored order record, protect against invalid submissions, and classify duplicate attempts in a way the future admin workflow can understand.

## What Changes

- Add `POST /api/orders` for quick-order submission.
- Add server-side order validation and phone normalization.
- Re-check selected products against current catalog state before accepting an order.
- Add duplicate detection based on normalized phone + selected products within a configured time window.
- Add Google Sheets write support for appending order rows to the `orders` sheet.
- Add an order service layer to encapsulate validation, duplicate logic, record creation, and sheet writes.
- Update the quick-order sheet to submit to the new API and show real success/error states from server results.

## Non-Goals

- Admin orders list or status-update UI
- Notification delivery implementation beyond placeholders if it is not already present
- Full order management workflows
- Payment, shipping, or checkout semantics
- CRM or advanced deduplication heuristics beyond the MVP rule

## Scope Notes

This change owns the write path for order creation only. It should prepare data in a way that later admin and notification milestones can build on, without forcing milestone 5 to solve the entire order lifecycle.

## Success Criteria

- Quick-order submissions are sent to a real backend endpoint.
- The backend validates phone, selected products, product status, and stock status before writing.
- Valid requests append rows to the `orders` Google Sheet.
- Duplicate attempts are classified consistently using the configured duplicate window.
- The quick-order UI responds to real backend success/error states instead of a purely local success state.
