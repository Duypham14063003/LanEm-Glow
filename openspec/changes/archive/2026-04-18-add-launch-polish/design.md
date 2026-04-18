# Design: Add Launch Polish

## Overview

This change is the final pass between feature completeness and launch. It should improve polish rather than expand scope.

The design focus is:

- mobile-first refinements
- baseline SEO and crawl readiness
- lightweight analytics instrumentation
- targeted QA fixes

## Product Scope

Included:

- mobile responsiveness and spacing refinements
- better metadata for homepage, product listing, and product detail
- `robots` and `sitemap`
- internal analytics helper and launch-critical event coverage
- final QA-driven refinements

Excluded:

- advanced SEO strategies such as structured product feeds or internationalization
- complex analytics vendor integrations
- new product modules
- large admin redesigns

## Launch Areas

```txt
Launch Polish
    │
    ├── Mobile fit and finish
    │     ├── sticky CTA behavior
    │     ├── spacing density
    │     ├── detail panel readability
    │     └── layout edge cases
    │
    ├── SEO basics
    │     ├── root metadata
    │     ├── page metadata
    │     ├── robots
    │     └── sitemap
    │
    ├── Analytics
    │     ├── shared trackEvent helper
    │     ├── product view
    │     ├── catalog search/filter
    │     ├── quick-order open
    │     └── quick-order success
    │
    └── QA pass
          ├── storefront core journeys
          ├── duplicate order journey
          └── admin order follow-up flow
```

## Key Decisions

### 1. Prioritize Public-Site SEO

SEO work should focus only on the public storefront pages. Admin routes do not need crawl optimization and should not receive launch SEO attention.

### 2. Use Shared Metadata Patterns

The root metadata is currently minimal. Launch polish should establish a reusable metadata pattern so homepage, products listing, and product detail pages can expose stronger titles and descriptions without ad hoc duplication.

### 3. Analytics Should Be Abstraction-First

The codebase should not scatter vendor-specific calls through UI components. A small shared helper such as `trackEvent(name, payload)` is enough for MVP launch instrumentation.

### 4. QA Fixes Should Stay Targeted

Milestone 8 is not an excuse for a broad refactor. Fixes should be limited to launch-critical inconsistencies discovered during QA.

## Expected Modules

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── (site)/
│       ├── page.tsx
│       ├── products/page.tsx
│       └── products/[slug]/page.tsx
├── lib/
│   ├── metadata.ts
│   └── analytics.ts
├── hooks/
│   └── launch analytics helpers if needed
└── key UI surfaces refined during QA
```

## SEO Scope

### Metadata

Recommended baseline:

- improved site title and description
- metadata per public page
- product detail metadata derived from product content
- better social sharing defaults

### Crawl Assets

Add:

- `robots.ts`
- `sitemap.ts`

The sitemap can remain simple and reflect the storefront’s public pages and product detail routes.

## Analytics Scope

Suggested events:

- `catalog_viewed`
- `catalog_filtered`
- `product_viewed`
- `quick_order_opened`
- `quick_order_submitted`
- `quick_order_submission_failed`
- `admin_order_updated`

The implementation can remain lightweight:

- dev-friendly no-op or console-safe fallback
- one central helper
- optional bridge to `window.dataLayer` or future provider integrations later

## QA Pass Focus

### Public journeys

- homepage to products listing
- products listing to detail
- detail to quick order
- quick order success and failure states

### Admin journeys

- orders list on mobile and desktop
- detail panel readability
- order status update flow

## Risks

### Scope creep into redesign work

Launch polish can easily drift into broad UI redesign. The scope should stay focused on launch-critical refinements.

### Analytics over-coupling

If analytics is wired directly to a specific vendor now, changing providers later will be annoying. The abstraction should stay intentionally thin.

### SEO assumptions without content strategy

Metadata should improve discoverability, but this milestone should avoid pretending that baseline metadata alone is a full SEO strategy.

## Assumptions

- The current feature set is launch-complete enough that milestone 8 can focus on polish.
- A lightweight analytics helper is sufficient for launch instrumentation.
- The public catalog remains the only SEO-relevant surface.
