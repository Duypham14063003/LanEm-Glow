# Add Catalog Read Layer

## Why

The project now has a UI foundation, but it still lacks the server-side data layer needed to power the storefront catalog. The product specification requires Google Sheets to act as the content source for products and public settings, while the frontend must consume normalized JSON through internal APIs rather than reading Sheets directly.

Without a dedicated read layer, future product listing, product detail, quick order validation, and admin read-only screens would all duplicate raw Google Sheets parsing and risk inconsistent behavior.

## What Changes

- Add a server-side Google Sheets client for reading the `products` and `settings` sheets.
- Define raw row models and normalized domain models for products and public settings.
- Add normalization/parsing logic to convert sheet values into typed objects.
- Add a server-side cache layer with TTL-driven catalog and settings caching.
- Add service modules to encapsulate product lookup, filtering, search, sorting, and public settings access.
- Add public read APIs:
  - `GET /api/products`
  - `GET /api/products/[slug]`
  - `GET /api/settings/public`

## Non-Goals

- Writing orders to Google Sheets
- Admin order management
- Product editing flows
- Quick order submission
- Full storefront pages that consume the APIs
- Notification or webhook behavior

## Scope Notes

This change focuses only on the read path for catalog and public settings data. The goal is to produce a clean, reusable backend-facing layer that later milestones can consume.

## Success Criteria

- The application can read catalog data from Google Sheets on the server.
- Product rows are normalized into consistent typed objects before being returned by the API.
- Public product APIs support core listing and detail reads without exposing raw sheet structure to the client.
- Catalog reads are cached using a configurable server-side TTL.
- The implementation creates a clean separation between Sheets access, normalization, services, and route handlers.
