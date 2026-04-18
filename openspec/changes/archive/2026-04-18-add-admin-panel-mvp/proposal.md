# Add Admin Panel MVP

## Why

The storefront can now capture real quick orders and persist them to the `orders` Google Sheet, but the team still lacks an internal workspace to review and process those orders efficiently.

Milestone 6 introduces the first admin-facing experience for the project. It should let operators review incoming orders, inspect customer and product details, and update order progress without editing Google Sheets by hand.

## What Changes

- Add an internal admin application shell with sidebar, topbar, and responsive content layout.
- Add an admin orders page with a table or list of orders sorted newest first.
- Add server-side order listing support with search and filters for order id, phone, status, duplicate flag, and date range.
- Add an order detail view for customer info, selected product snapshot, inbound source metadata, and internal admin notes.
- Add `PATCH /api/orders/[id]` so admins can update order status and internal notes.
- Extend the orders service layer to normalize rows for admin read/update use cases.
- Add basic loading and empty states for the admin orders experience.

## Non-Goals

- Full authentication and authorization system
- Product editing inside the admin panel
- Settings management UI beyond placeholders or deferred routes
- Notification delivery workflows
- Analytics dashboards or reporting beyond the orders list itself

## Scope Notes

This change is intentionally focused on the order operations slice of the admin panel. It creates the admin shell and the core orders workflow first so later milestones can build product and settings modules on top of the same structure.

Because the current codebase does not yet include auth or middleware, this MVP should treat the admin routes as an internal tooling surface rather than a production-hardened secure back office.

## Success Criteria

- Admin routes render within a dedicated admin layout.
- Orders can be listed from Google Sheets in newest-first order.
- Admins can search and filter the orders dataset.
- Admins can inspect a single order in a detail panel or dedicated detail surface.
- Admins can update order status and admin note through internal APIs.
- The UI reflects loading, empty, success, and failure states clearly for the admin workflow.
