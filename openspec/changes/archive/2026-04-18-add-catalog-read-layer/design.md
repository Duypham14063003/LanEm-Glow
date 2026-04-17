# Design: Add Catalog Read Layer

## Overview

This change introduces the first backend data-access slice for LanEm Glow. It converts Google Sheets into an internal read model that the frontend can safely consume through route handlers. The design intentionally separates concerns so the raw sheet structure does not leak into the client or page-level code.

## Architectural Flow

```txt
Google Sheets API
       │
       ▼
  lib/sheets.ts
       │
       ▼
raw sheet rows
       │
       ▼
normalizers/parsers
       │
       ▼
typed domain models
       │
       ▼
 lib/cache.ts
       │
       ▼
 services/*
       │
       ▼
route handlers
```

## Key Decisions

### 1. Route Handlers Must Not Parse Raw Sheet Rows

Route handlers should only:

- parse request query parameters
- call the relevant service method
- return JSON or HTTP errors

They must not know Google Sheets column names, delimiter rules, or normalization details.

### 2. Separate Raw and Normalized Models

Use two conceptual data layers:

- `RawProductRow`: values read from Google Sheets, mostly string-based
- `Product`: normalized object used by services and APIs

This separation prevents downstream code from inheriting parsing logic for numbers, booleans, delimiters, and optional fields.

### 3. Server-Side Memory Cache Is Enough for V1

For the current MVP scope, an in-process TTL cache is sufficient.

- Cache key: `catalog:all`
- Cache key: `settings:public`
- TTL source: `CATALOG_CACHE_TTL_SECONDS`

This is intentionally simple and can be replaced later if deployment characteristics demand a shared cache.

### 4. Settings Access Should Be Narrowed

The `settings` sheet is modeled as generic key-value storage, but the public API should expose only a safe subset required by the storefront. The settings service should map raw rows into a typed public settings object rather than returning arbitrary keys.

### 5. Listing Filters Should Be Kept Focused

For the first read layer, the listing API should support only the filters clearly required by the product specification:

- text search (`q`)
- `category`
- `concern`
- `featured`
- `stockStatus`

Avoid premature expansion into advanced pagination, faceting, or ranking logic.

## Expected Modules

```txt
src/
├── app/api/
│   ├── products/route.ts
│   ├── products/[slug]/route.ts
│   └── settings/public/route.ts
├── lib/
│   ├── sheets.ts
│   ├── cache.ts
│   └── validation.ts        (optional light runtime guards)
├── services/
│   ├── products.ts
│   └── settings.ts
└── types/
    └── index.ts
```

## Data Normalization Rules

### Product rows

- `gallery_urls`: split by `|`
- `search_keywords`: split into a string array
- `price`, `compare_at_price`, `display_order`: parse as numbers
- `is_featured`: parse as boolean
- `status`, `stock_status`: validate against known allowed values
- `status !== active`: exclude from public catalog results

### Concern handling

Although the sheet schema presents `skin_concern` as a string field, the read layer should normalize it into a string-array-friendly representation internally so filtering can evolve without rewriting the data layer.

### Settings rows

Map `settings` key-value rows into a typed public settings object with only storefront-safe keys exposed.

## Error Strategy

- Fail fast on missing Google Sheets configuration.
- Handle malformed rows defensively:
  - skip clearly broken rows when possible
  - surface actionable server errors if the entire sheet is unusable
- Return `404` for missing product slugs.
- Keep raw Google API errors out of public responses.

## Risks

### Sheet schema drift

If spreadsheet column headers are renamed or reordered carelessly, normalization can silently fail. The implementation should validate the presence of required columns up front.

### Data cleanliness

Google Sheets is flexible, which means values like booleans, numbers, and delimited strings may be inconsistent. The normalizer must be forgiving but predictable.

### Cache invalidation expectations

With TTL-based memory cache, updates in Google Sheets are not reflected instantly. This is acceptable for MVP, but the implementation should make cache lifetime explicit and configurable.

## Assumptions

- The project will continue using Google Sheets as the source of truth for product content in v1.
- Public storefront pages will consume the internal APIs, not call Google directly.
- A simple in-process cache is acceptable for the current deployment phase.
