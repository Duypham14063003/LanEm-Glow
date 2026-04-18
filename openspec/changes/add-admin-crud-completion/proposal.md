# Add Admin CRUD Completion

## Why

The admin area now covers order operations and product management in meaningful ways, but it still stops short of a complete internal operations workspace.

Three gaps remain:

- products do not yet expose a practical delete/archive action
- orders are still focused on follow-up updates rather than a fuller admin lifecycle
- settings remain a placeholder rather than an editable admin surface

This change completes the core admin workflow so internal users can manage products, orders, and storefront settings from one place without falling back to direct Google Sheets edits for common tasks.

## What Changes

- Complete admin product management with a soft-delete/archive flow using the existing product status model.
- Extend the admin orders workflow with fuller lifecycle controls, including manual order creation and non-destructive archive/cancel behavior instead of hard delete.
- Replace the admin settings placeholder with a real fixed-field settings form backed by the existing `settings` Google Sheet.
- Add the supporting service, API, validation, and UI flows needed for these operations.
- Keep Google Sheets as the source of truth and preserve an audit-friendly, non-destructive operational model where possible.

## Non-Goals

- Hard-deleting order rows from Google Sheets
- Turning settings into a generic key-value schema editor
- Authentication and authorization hardening beyond the current internal-tooling assumption
- Full back-office analytics or reporting dashboards
- Replacing Google Sheets with a database

## Scope Notes

This change should build on top of the active admin product management and product image upload work rather than re-implementing those foundations.

For destructive-sounding actions, the implementation should bias toward business-safe semantics:

- products: archive via `inactive`
- orders: cancel/archive via status or equivalent retained-record flow
- settings: update known keys in a fixed form instead of deleting arbitrary rows

## Success Criteria

- Admins can archive products without removing source rows from Google Sheets.
- Admins can create a manual order and manage its lifecycle without deleting order history.
- Admins can view and update the known storefront settings from the admin panel.
- Admin CRUD operations return clear validation and failure states.
- The admin area feels operationally complete for day-to-day catalog, order, and settings tasks.
