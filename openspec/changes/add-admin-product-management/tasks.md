# Tasks

## 1. Product Admin Models And Validation

- [x] Extend shared product-related types for admin listing and mutation payloads.
- [x] Add validation and normalization helpers for admin product form input.
- [x] Define duplicate checks for `product_id` and `slug`.

## 2. Sheets Support For Product Writes

- [x] Reuse or extend Google Sheets helpers to locate a product row by `product_id`.
- [x] Add product row append and update flows for the `products` tab.
- [x] Surface controlled errors for missing rows, duplicate identifiers, and write failures.

## 3. Admin Product Service Layer

- [x] Add service functions to list products for admin use cases with optional search/filter behavior.
- [x] Add service functions to create a new product row from normalized admin payloads.
- [x] Add service functions to update an existing product row and preserve immutable fields.
- [x] Invalidate catalog cache after successful product writes.

## 4. Admin Product APIs

- [x] Implement `GET /api/admin/products` for internal product listing.
- [x] Implement `POST /api/admin/products` for product creation.
- [x] Implement `PATCH /api/admin/products/[id]` for product updates.
- [x] Return clear error responses for invalid payloads, duplicate identifiers, missing products, and failed writes.

## 5. Admin Products UI

- [x] Replace the placeholder admin products page with a real products workspace.
- [x] Add a product list that shows core operational fields such as name, category, price, status, stock, and featured state.
- [x] Add create and edit entry points from the admin products workspace.
- [x] Add a reusable admin product form with clear validation states and save feedback.

## 6. Verification

- [x] Add tests for admin product normalization, duplicate detection, and write behavior.
- [x] Add tests for the admin product APIs.
- [x] Verify lint, type-check, and test suite pass.
