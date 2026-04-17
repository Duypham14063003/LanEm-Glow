# Tasks

## 1. Types And Contracts

- [x] Define raw row and normalized domain types for products and public settings.
- [x] Define allowed unions or enums for product status and stock status.
- [x] Define API-facing query parameter contracts for catalog listing filters.

## 2. Google Sheets Read Client

- [x] Add a server-side Sheets client that reads values from named tabs.
- [x] Validate required environment variables for Google service account access.
- [x] Add row/header handling so sheet data can be converted into keyed records safely.

## 3. Normalization Layer

- [x] Implement product row normalization from raw sheet values into typed objects.
- [x] Normalize booleans, numbers, delimited arrays, and optional values consistently.
- [x] Exclude inactive products from public catalog results.
- [x] Implement public settings normalization from key-value rows into a typed object.

## 4. Cache Layer

- [x] Add a lightweight server-side TTL cache helper for catalog and settings reads.
- [x] Read cache duration from `CATALOG_CACHE_TTL_SECONDS`.
- [x] Ensure cached reads can be bypassed or refreshed internally when needed by future milestones.

## 5. Services

- [x] Add a product service that loads, caches, filters, searches, sorts, and resolves products by slug.
- [x] Add a settings service that exposes only public storefront-safe settings.
- [x] Keep raw Google Sheets details contained below the service layer.

## 6. Public APIs

- [x] Implement `GET /api/products` with support for basic search and filter query params.
- [x] Implement `GET /api/products/[slug]` for product detail reads.
- [x] Implement `GET /api/settings/public` for storefront-safe settings reads.
- [x] Return normalized JSON responses and appropriate HTTP status codes.

## 7. Verification

- [x] Add enough verification to confirm normalization logic behaves correctly on representative input.
- [x] Verify lint and type-check pass.
- [x] Verify the public APIs fail gracefully when configuration is missing or data is malformed.
