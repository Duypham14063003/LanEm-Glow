# Tasks

## 1. Product Admin Completion

- [x] Add a product archive/deactivate action in the admin workflow.
- [x] Persist product soft-delete behavior by setting `status` to `inactive` instead of removing rows.
- [x] Return clear success and failure feedback for product archive actions.

## 2. Orders Admin Completion

- [x] Add admin-side manual order creation support.
- [x] Reuse or extend order validation, stock checks, and duplicate detection for internal order creation.
- [x] Add a non-destructive archive/cancel action for admin orders without deleting rows.
- [x] Update admin orders UI to expose the new creation and lifecycle actions cleanly.

## 3. Settings Admin Completion

- [x] Add a fixed-field admin settings read model for the known storefront settings keys.
- [x] Add settings write helpers that update or upsert known keys in the `settings` sheet.
- [x] Implement admin settings APIs for reading and saving the fixed settings form.
- [x] Replace the admin settings placeholder with a real editable settings workspace.

## 4. Verification

- [x] Add tests for product archive behavior, manual order creation, and settings update behavior.
- [x] Add tests for the new or extended admin APIs.
- [x] Verify lint, type-check, and test suite pass.
