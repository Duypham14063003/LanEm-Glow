# Design: Add Customer Storefront Pages

## Overview

This change builds the first real storefront experience on top of the existing foundation and catalog read layer. It should replace the current theme preview with customer-facing routes while preserving the visual language established in milestone 1 and the data boundaries established in milestone 2.

The storefront must feel intentional, premium, soft, and mobile-friendly, while remaining implementation-focused rather than over-engineered.

## Scope Boundary

The most important design boundary in this change is:

- **In scope**: browse, discover, search, filter, inspect product details
- **Out of scope**: persistent selected-product state, sticky quick-order bar, quick-order sheet, and order submission

This keeps milestone 3 centered on discovery and milestone 4 centered on conversion flow.

## Route Structure

```txt
src/app/
├── (site)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── products/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
```

The existing root preview page should no longer act as the storefront final UI. The new `(site)` group should own customer-facing rendering.

## Rendering Strategy

### 1. Prefer Server Rendering For Initial Content

Homepage, products listing, and product detail should render from server-side service calls wherever possible.

Benefits:

- simpler data flow
- fewer client fetch hops
- better first render
- easier SEO baseline

### 2. Use Client Islands For Small Interactions

Search/filter interactions can use small client-side components where needed, but the whole storefront should not be converted into a large client-only application.

Good candidates for client islands:

- search input enhancements
- filter chip interactions
- URL synchronization helpers

### 3. Use Services Directly In Pages

Pages should consume the existing service layer directly rather than fetching the app's own internal APIs for server-rendered content. The API routes remain useful for future client-side interactions and integrations, but server pages do not need the extra network hop.

## Shared Site Components

Expected site-level components:

- `SiteHeader`
- `SiteFooter`
- `PageSection`
- `TrustStrip`
- `ConcernScroller`
- `ProductCard`
- `TestimonialCard`

These components should be visually aligned with the LanEm Glow token system and optimized for mobile-first reading and conversion intent.

## Homepage Composition

```txt
Hero
  ↓
Trust strip
  ↓
Featured products
  ↓
Concern navigation
  ↓
Social proof
  ↓
Repeat CTA
```

Homepage data dependencies:

- public settings
- featured products
- concern shortcuts (derived from curated values or product concerns)

## Listing Page Composition

```txt
Header / intro
  ↓
Search bar
  ↓
Concern/category chips
  ↓
Optional “clear filters”
  ↓
Product grid
  ↓
Empty state if no matches
```

Listing page should be URL-driven:

- `/products?q=serum`
- `/products?concern=phuc-hoi`
- `/products?category=serum&stockStatus=in_stock`

This makes filters shareable and keeps navigation behavior natural.

## Product Detail Composition

```txt
Gallery
  │
Summary block
  │
Description / concern tags / usage guidance
  │
CTA block
  │
Related products
```

Related products can be derived from the same category or overlapping concerns. Keep the heuristic simple for v1.

## Data Dependencies

This change depends on the existing catalog read layer:

- `listCatalogProducts`
- `getCatalogProductBySlug`
- `getPublicSettings`

Potential minor data extension may be needed later, but this milestone should avoid reopening the catalog layer unless storefront implementation reveals a real gap.

## Risks

### Scope creep into milestone 4

Adding selection state, sticky CTA behavior, or quick-order sheet logic here would blur the milestone boundary and increase complexity significantly.

### Too many thin components

The storefront needs reusable parts, but the implementation should avoid creating many components with little reuse or unclear ownership.

### Over-clientifying the listing page

If the listing page becomes entirely client-side too early, the codebase may lose the clarity and simplicity gained from the service layer.

## Assumptions

- The current public settings object is sufficient for basic header/footer and CTA rendering.
- The existing product model contains enough fields to render homepage cards, listing cards, and detail views.
- Search and core filters from the catalog read layer are enough to support milestone 3 without expanding API scope further.
