# Design: Add Quick Order Flow

## Overview

This change adds the first conversion-oriented interaction layer to the storefront. It introduces a shared selected-product state, a mobile sticky action surface, and a bottom-sheet-based quick-order form. The design must stay intentionally lightweight: this is not a cart system and not a full checkout.

## Interaction Model

```txt
Product CTA click
      │
      ▼
selected-product state
      │
      ├── updates button states
      ├── drives sticky mobile bar
      └── feeds quick-order sheet summary
                      │
                      ▼
              phone / name / note form
                      │
                      ▼
             submission-ready payload
```

## Key Decisions

### 1. Selected State Must Live Above Pages

Selected products cannot be stored locally inside product cards or individual pages. Selection should persist across listing/detail navigation and should drive shared UI surfaces such as the sticky bar and quick-order sheet.

The state owner should live under the customer-facing site layout, so all storefront routes can access it consistently.

### 2. Use Lightweight Persistence

Use client-side persistence for selected products, such as `localStorage`, so selected items survive refresh and route changes.

This should remain intentionally simple:

- no quantity handling
- no multi-cart logic
- no account sync

### 3. Product Selection Is Not Full Cart Behavior

Selection means “customer is interested in these items and may want to leave their phone number,” not “customer has started a commerce checkout.”

The system should track:

- product identity
- key summary fields for sheet-ready preview
- stock status safety

It should not track:

- quantity
- shipping
- payment
- promo logic

### 4. Bottom Sheet Should Be Reusable

Although the immediate target is quick order, the bottom sheet should be implemented as a reusable primitive because the specification also references bottom sheets for mobile filter interactions later.

### 5. UI Flow And Backend Write Path Should Stay Loosely Coupled

The quick-order sheet should collect valid data and prepare a submission shape, but the design should not force milestone 4 to fully own backend persistence details if milestone 5 is meant to handle that layer.

## Expected Modules

```txt
src/
├── components/
│   ├── ui/
│   │   └── bottom-sheet.tsx
│   └── site/
│       ├── quick-order-bar.tsx
│       └── quick-order-sheet.tsx
├── hooks/
│   ├── use-selected-products.ts
│   └── use-quick-order.ts
└── app/(site)/
    └── layout or provider boundary
```

## State Shape

Suggested selected-product entry:

```txt
{
  id,
  slug,
  name,
  price,
  imageUrl,
  stockStatus
}
```

This is enough for UI rendering and later submission payload mapping.

## Component Responsibilities

### `use-selected-products`

- add product
- remove product
- toggle product
- clear all
- check if selected
- expose count and items

### `use-quick-order`

- open sheet
- close sheet
- expose current open state
- optionally capture open source for future analytics

### `QuickOrderBar`

- only visible when selection count > 0
- mobile-first sticky bottom placement
- shows selected count
- opens quick-order sheet

### `QuickOrderSheet`

- renders selected item summary
- supports item removal
- renders form inputs
- validates client-side constraints
- transitions among closed / editing / submitting / success states

## Validation Rules

At minimum:

- `phone` is required
- selected products count must be > 0
- out-of-stock products cannot be newly selected
- phone must match the storefront mobile regex

The client flow should be structured so a later backend submit handler can reuse or mirror these rules.

## Integration Points

Immediate integration points in the current codebase:

- `ProductCard` button in products listing and homepage
- product detail primary CTA
- product detail secondary CTA
- site layout, which should host the provider and shared quick-order surfaces

## Risks

### Scope collision with milestone 5

If this milestone tries to fully own order persistence, duplicate detection, and stock revalidation, it will blur the milestone boundary and become much larger than intended.

### Inconsistent selection experience

If listing cards and detail pages implement selection differently, the storefront will feel unreliable. The same shared state contract must drive both.

### Overcomplicated modal state

Quick order should feel fast and light. Avoid turning the sheet into a multi-step checkout or highly animated flow.

## Assumptions

- The product model already contains enough fields to support selection summary UI.
- Quick order remains intentionally lightweight and separate from payment/check-out mechanics.
- A reusable bottom-sheet primitive is justified because future milestones can reuse it.
