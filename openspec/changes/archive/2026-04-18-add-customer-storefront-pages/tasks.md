# Tasks

## 1. Site Shell

- [x] Add a customer-facing route group and shared site layout.
- [x] Implement `SiteHeader`, `SiteFooter`, and a reusable `PageSection` wrapper.
- [x] Replace the temporary preview page with a real homepage entry point.

## 2. Homepage

- [x] Build the homepage hero with primary and secondary calls to action.
- [x] Implement a `TrustStrip` section for short credibility messages.
- [x] Render featured products from the catalog service.
- [x] Add concern navigation and a lightweight social proof/testimonial section.
- [x] Add repeated conversion-oriented CTA blocks without implementing the full quick-order flow.

## 3. Listing Page

- [x] Add the `/products` page.
- [x] Implement listing search and URL-driven filters.
- [x] Add chip-based concern/category filtering UI.
- [x] Render the catalog grid with `ProductCard` components.
- [x] Add empty and loading-friendly states for no-result scenarios.

## 4. Product Detail Page

- [x] Add the `/products/[slug]` page.
- [x] Render gallery, summary, price, stock state, and concerns.
- [x] Render descriptive content sections using normalized product data.
- [x] Add a simple related-products section.
- [x] Return `notFound()` behavior for missing product slugs.

## 5. Storefront Components

- [x] Implement `ProductCard` for homepage and listing reuse.
- [x] Implement `ConcernScroller` for quick topic navigation.
- [x] Implement `TestimonialCard` or equivalent lightweight social proof block.
- [x] Keep storefront component styling aligned with the established LanEm Glow theme.

## 6. Verification

- [x] Verify homepage, listing, and detail pages compile against the existing catalog/service layer.
- [x] Verify lint and type-check pass.
- [x] Verify storefront routes behave sensibly when settings or product data are missing.
