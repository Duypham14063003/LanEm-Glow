# Design

## Overview

This change extends the existing Google Sheets-based catalog system with an internal admin write layer and a matching admin UI surface. The goal is to preserve the current storefront read model while making catalog operations manageable from the admin panel.

The design keeps Google Sheets as the source of truth and builds a thin application layer around it:

- admin product read model
- admin product create/update validation
- Google Sheets append/update support for the `products` tab
- cache invalidation for storefront catalog reads
- admin-facing list and form workflows

## Data Flow

```text
Admin products page
├── load product list
│   └── admin product service
│       └── read products sheet rows
│           └── normalize into admin list items
└── submit create/update form
    └── admin product API
        └── admin product service
            ├── validate and normalize payload
            ├── append or update products sheet row
            └── invalidate catalog cache
                └── storefront reads fresh catalog data
```

## Product Identity

`product_id` should be treated as the stable identifier for admin update flows. `slug` remains important for storefront routing and uniqueness, but row updates should not rely on slug because operators may need to edit it.

For updates:

- locate the row by `product_id`
- preserve `created_at`
- overwrite mutable fields
- refresh `updated_at`

For creation:

- require a unique `product_id`
- require a unique `slug`
- set both `created_at` and `updated_at`

## Admin Write Model

The existing storefront read model already normalizes `RawProductRow` into `Product`. This change should introduce a companion admin payload model for form submission.

Recommended normalized fields:

- `productId`
- `slug`
- `name`
- `shortDescription`
- `description`
- `category`
- `concerns`
- `price`
- `compareAtPrice`
- `imageUrl`
- `galleryUrls`
- `status`
- `stockStatus`
- `isFeatured`
- `displayOrder`
- `searchKeywords`

Delimited sheet fields should continue to use the current conventions:

- `skin_concern`: pipe- or comma-delimited input normalized to a consistent delimiter when written
- `gallery_urls`: delimited list
- `search_keywords`: delimited list

## Validation Rules

The admin product form should reject invalid or inconsistent data early.

Validation should include:

- required text fields for identity and storefront presentation
- numeric validation for `price` and `display_order`
- optional numeric validation for `compare_at_price`
- enum validation for `status` and `stock_status`
- boolean normalization for `is_featured`
- uniqueness checks for `product_id` and `slug`

Recommended normalization:

- trim whitespace on all text fields
- lowercase `slug`
- lowercase list-style keywords and concerns
- collapse duplicate items in list-style fields

## API Shape

The admin workflow should use dedicated admin APIs rather than reusing public catalog endpoints.

Recommended endpoints:

- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/[id]`

These endpoints should return normalized admin-safe product payloads and clear error responses for:

- invalid request shape
- duplicate `product_id`
- duplicate `slug`
- missing target product
- failed sheet write

## UI Shape

The MVP can use a single products workspace with:

- admin topbar
- product list with lightweight search/filter controls
- create button
- edit action per row
- product form surface using either a side panel, bottom sheet, or route-based form

For speed and coherence with the current admin shell, a single workspace page with a modal/panel form is acceptable. Route-based detail pages can be deferred unless they materially simplify implementation.

## Cache Invalidation

After any successful create or update:

- invalidate `catalog:all`

If future product caches become more granular, the invalidation logic should be centralized so admin writes do not need to know every downstream cache key.

## Risks

### Sheets as mutable storage

Google Sheets updates are row-oriented and not transactional. The implementation should keep writes simple, deterministic, and easy to retry.

### Duplicate identifiers

If operators accidentally reuse a `product_id` or `slug`, storefront behavior could become inconsistent. The admin service should guard against this before writing.

### Delimited field drift

The sheet currently stores several list fields as delimited strings. The admin form should normalize these consistently so later reads do not produce surprising results.
