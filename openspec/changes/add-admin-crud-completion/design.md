# Design

## Overview

This change completes the internal admin workspace across three domains:

- products
- orders
- settings

The design intentionally avoids forcing a database-like CRUD model onto Google Sheets where it would create risk. Instead, it maps each domain to the safest practical operational semantics.

```text
Admin workspace
├── Products
│   ├── list
│   ├── create
│   ├── update
│   └── archive via inactive status
├── Orders
│   ├── list
│   ├── manual create
│   ├── update
│   └── cancel/archive without row deletion
└── Settings
    ├── read known keys
    └── update known keys
```

## Products

### Current baseline

Active product management work already provides:

- list
- create
- update
- image upload support in a separate active change

This change should only add the missing lifecycle action:

- soft delete / archive

### Product delete semantics

Products should not be hard-deleted from the `products` sheet in this milestone. Instead:

- set `status` to `inactive`
- preserve the row
- invalidate catalog cache

This aligns with the storefront read model, which already filters to active products.

## Orders

### Current baseline

Admin orders currently support:

- list
- filter
- inspect
- update status and admin note

### Manual create

The admin should be able to create an order directly from the admin area using a controlled internal form. This flow can reuse the order write layer where possible, but it should support internal defaults more explicitly than the customer-facing quick-order flow.

Recommended fields:

- phone
- customer name
- selected product ids
- customer note
- source page
- source campaign

The system should still enforce stock checks and duplicate detection rules unless there is a clear internal override requirement.

### Delete semantics

Orders should not be hard-deleted from the sheet. Instead:

- use `cancelled`, `invalid`, or an equivalent archive-friendly status
- preserve row history

If the admin needs a visual archive action, it should map to a retained-record state transition rather than a row removal.

## Settings

### Fixed-form model

Settings should not become a generic key-value editor in this milestone. The current app reads a small set of known storefront settings, so the admin settings page should use a fixed form for those known keys.

Recommended fields:

- `brand_phone`
- `zalo_url`
- `public_announcement`
- `primary_cta_label`
- `secondary_cta_label`

### Write behavior

The settings service should:

- read the `settings` sheet
- upsert known keys
- preserve other unknown rows if they exist
- invalidate cached public settings after save

## API Shape

Recommended additions:

- products:
  - `PATCH /api/admin/products/[id]` extended to support archive semantics if not already covered cleanly
- orders:
  - `POST /api/admin/orders`
  - `PATCH /api/admin/orders/[id]` extended as needed for archive/cancel actions
- settings:
  - `GET /api/admin/settings`
  - `PATCH /api/admin/settings`

These APIs should return normalized admin-safe payloads with clear error codes.

## Cache And Consistency

After successful writes:

- product changes should invalidate catalog cache
- settings changes should invalidate settings cache

Order changes do not currently depend on shared cache in the same way, but list/detail consistency should still be maintained in the admin UI.

## Risks

### Overloading CRUD language

Not every domain should implement literal hard delete. The UI and API should use words like `archive`, `deactivate`, or `cancel` where those semantics are safer.

### Settings row drift

The `settings` sheet is key-value based, so write helpers should update known keys predictably without accidentally dropping unrelated rows.

### Manual order creation complexity

Manual admin order creation may overlap with customer quick-order rules. Reuse should be deliberate so business logic does not diverge between internal and public order creation paths.
