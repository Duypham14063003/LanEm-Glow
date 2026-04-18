# Tasks

## 1. Admin Types And Orders Read Model

- [x] Extend shared order types with admin list item, detail, query, and patch payload contracts.
- [x] Add normalized order read helpers for listing and single-order detail use cases.
- [x] Define mutable admin-managed order fields and status transition guards.

## 2. Sheets Update Support

- [x] Extend the Google Sheets helper with row update support for the `orders` tab.
- [x] Add a reliable way to locate an order row by `order_id`.
- [x] Surface controlled errors when row lookup or row updates fail.

## 3. Orders Service For Admin Use Cases

- [x] Add service functions to list orders with newest-first sorting and query filters.
- [x] Add service functions to read a single order by id.
- [x] Add service functions to update `status`, `admin_note`, and `processed_at`.

## 4. Admin Orders APIs

- [x] Implement `GET /api/orders` for admin listing.
- [x] Implement `PATCH /api/orders/[id]` for status and admin note updates.
- [x] Return clear error responses for invalid filters, missing orders, and failed updates.

## 5. Admin Shell And Navigation

- [x] Add `src/app/admin/layout.tsx` with responsive sidebar and topbar.
- [x] Add `src/app/admin/page.tsx` and route flow into the orders workspace.
- [x] Add placeholder admin products and settings pages without expanding scope into editing flows.

## 6. Admin Orders UI

- [x] Add the admin orders page with search, filters, table/list, loading, and empty states.
- [x] Add an order detail surface that displays customer, product, source, and note data.
- [x] Add controls to update order status and admin note from the detail surface.

## 7. Verification

- [x] Add tests for order listing filters and order update behavior.
- [x] Add tests for `GET /api/orders` and `PATCH /api/orders/[id]`.
- [x] Verify lint, type-check, and test suite pass.
