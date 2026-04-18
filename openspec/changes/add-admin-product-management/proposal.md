# Add Admin Product Management

## Why

The admin panel currently includes only the orders workflow. Product management is still handled manually in the `products` Google Sheet, which creates friction for day-to-day operations and makes the admin panel feel incomplete.

An internal product management MVP would let operators browse the catalog, add new products, and update existing entries without editing raw sheet rows by hand, while still preserving Google Sheets as the source of truth for the storefront.

## What Changes

- Replace the placeholder admin products page with a real catalog management workspace.
- Add admin-side product listing support backed by the existing `products` Google Sheet.
- Add create and update flows for product records using the current sheet schema.
- Add validation and normalization for admin-managed product fields such as slug, price, concerns, search keywords, featured state, and stock state.
- Add admin product APIs and service-layer write helpers for Google Sheets row creation and updates.
- Invalidate product cache entries after successful writes so the storefront can reflect fresh catalog data quickly.

## Non-Goals

- Migrating product storage away from Google Sheets
- Adding image upload or media hosting workflows
- Bulk import/export or spreadsheet sync tooling beyond the current source of truth
- Full authentication and authorization hardening
- Rich product merchandising features such as drag-and-drop ordering or audit history

## Scope Notes

This change should stay focused on a practical MVP for internal operators. The admin UI can prioritize clarity and correctness over advanced UX flourishes, as long as the forms are easy to understand and the operational workflow is meaningfully simpler than editing the sheet directly.

Google Sheets remains the source of truth. The implementation should adapt to the existing catalog column schema rather than inventing a separate admin-only representation that drifts from what the storefront already reads.

## Success Criteria

- Admin users can open a real products workspace instead of a placeholder.
- Admin users can see existing catalog items with the operational fields needed for quick management.
- Admin users can create a new valid product row from the admin UI.
- Admin users can update an existing product and persist the change back to Google Sheets.
- Duplicate or invalid input is rejected with clear feedback before or during save.
- Storefront catalog reads pick up successful admin edits without waiting for a long cache expiry.
