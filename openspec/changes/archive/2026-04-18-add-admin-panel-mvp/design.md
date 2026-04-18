# Design: Add Admin Panel MVP

## Overview

This change adds the first internal admin surface for LanEm Glow. The design centers the MVP on order operations, because orders are already persisted and now need a practical review and follow-up workflow.

The admin experience should be lightweight, responsive, and aligned with the existing UI foundation rather than introducing a separate visual system.

## Product Scope

The MVP includes:

- admin layout shell
- orders list page
- order detail surface
- order status and admin note updates

The MVP does not include:

- auth
- product editing
- settings editing
- analytics dashboards

## Admin Information Architecture

```txt
Admin Layout
    │
    ├── /admin
    │     └── redirect or summary into orders workflow
    │
    ├── /admin/orders
    │     ├── filters + search
    │     ├── orders table/list
    │     └── detail panel
    │
    ├── /admin/products
    │     └── placeholder or read-only stub
    │
    └── /admin/settings
          └── placeholder or deferred stub
```

## UX Model

### 1. Shell

Desktop uses a fixed left sidebar and a top content bar. Mobile collapses navigation into a slide-over or compact header control.

### 2. Orders List

The list is the primary admin workspace and should include:

- order id
- created time
- customer phone
- customer name
- item count
- order status
- duplicate badge

The list should sort newest first by default.

### 3. Detail Surface

Selecting an order should open a detail panel or sheet that shows:

- phone
- customer name
- selected product ids
- selected product names snapshot
- customer note
- source page
- source campaign
- duplicate flag
- admin note
- processed timestamp

The detail surface should also include controls to update:

- `status`
- `admin_note`

### 4. Empty And Loading States

The admin view should feel intentional even before real data volume exists. Loading skeletons and a friendly empty state are part of MVP quality.

## Data Flow

```txt
Admin Orders Page
      │
      ├── GET /api/orders?...
      │       │
      │       └── orders service
      │             ├── read orders sheet
      │             ├── normalize row values
      │             ├── sort newest first
      │             └── apply search/filter query
      │
      └── PATCH /api/orders/[id]
              │
              └── orders service
                    ├── find row by order_id
                    ├── validate status/note payload
                    ├── update mutable columns
                    └── return normalized updated order
```

## Key Decisions

### 1. Reuse The Existing Orders Service

The current `orders` service already knows the orders schema and normalization rules. Milestone 6 should extend it rather than creating a second admin-only data layer.

### 2. Search And Filters Live Server-Side

Even though Google Sheets is small enough for MVP reads, the API should own search and filtering logic so the admin UI remains thin and later improvements do not require UI rewrites.

### 3. Google Sheets Update Uses `order_id` As The Stable Key

Order updates should locate rows by `order_id`, not by list index rendered in the UI. The service layer should be responsible for resolving the correct row and writing updates back to the `orders` tab.

### 4. `processed_at` Should Reflect Operational Handling

When an order transitions away from `new`, the service should populate `processed_at` if it is empty. This gives the admin panel a useful operational signal without requiring event history.

### 5. Keep Placeholder Routes Minimal

The project structure in the spec mentions admin products and settings pages, but milestone 6 should keep them as placeholders or deferred surfaces so the orders workflow stays the focus.

## Expected Modules

```txt
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── orders/route.ts
│       └── orders/[id]/route.ts
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── orders-table.tsx
│   │   └── order-detail-panel.tsx
│   └── ui/
│       ├── table.tsx
│       └── modal.tsx or drawer-equivalent
├── services/orders.ts
└── types/index.ts
```

## API Shape

### GET `/api/orders`

Suggested query params:

- `q`
- `status`
- `duplicate`
- `dateFrom`
- `dateTo`

Returns:

- normalized order items
- total count
- echoed query state

### PATCH `/api/orders/[id]`

Suggested payload:

```json
{
  "status": "contacted",
  "adminNote": "Customer asked to confirm tomorrow morning."
}
```

Returns:

- normalized updated order

## Risks

### Google Sheets row update complexity

Updating a specific row is more fragile than append-only writes. The service must map `order_id` to the correct sheet row reliably.

### Scope drift into full admin platform work

If this change also tries to solve auth, settings, and product management, the MVP loses focus quickly.

### UI complexity on mobile

The admin panel still needs to work on smaller screens, so the detail surface and filters should avoid desktop-only assumptions.

## Assumptions

- Internal users can access admin routes without auth for this MVP phase.
- Reading and filtering the full orders sheet remains acceptable for the current expected data volume.
- Product and settings admin modules can remain placeholder pages until later milestones.
