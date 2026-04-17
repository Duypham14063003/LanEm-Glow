# Design: Bootstrap Theme Foundation

## Overview

This change establishes the UI and application base layer for LanEm Glow. The goal is to translate the visual direction from the product specification into implementation-ready tokens and reusable primitives, while keeping the initial codebase intentionally small.

The foundation should support both customer-facing and admin-facing surfaces, but only at the theme and primitive level in this change.

## Architectural Decisions

### 1. Application Scaffold

- Use Next.js 15 with the App Router.
- Keep source files under `src/` to match the technical structure defined in the product spec.
- Create a minimal route shell rather than building full milestone 3 pages in this change.

### 2. Theme Token Strategy

Use CSS custom properties in `src/app/globals.css` as the source of truth for design tokens.

Token groups:

- Colors
- Typography scale
- Spacing scale
- Radius scale
- Shadow/elevation
- Motion timing/easing

This keeps Tailwind utility usage flexible while preserving a clear brand token layer that can also be reused in plain CSS when needed.

### 3. Typography

- Heading font: `Cormorant Garamond`
- Body font: `Be Vietnam Pro`
- Load fonts at the root layout level using Next.js font integration.
- Expose font family variables so primitives and future layouts can compose them consistently.

### 4. Primitive Component Philosophy

The primitive layer should favor:

- Soft, polished defaults
- Clear interactive states
- Strong mobile readability
- Accessible focus states
- Variant APIs that remain small and predictable

Avoid building large abstractions too early. Components should be simple wrappers with consistent token usage.

### 5. Initial Primitive Set

Implement the primitives that unlock the next milestones first:

- `Button`
- `Input`
- `Textarea`
- `Chip`
- `Badge`
- `Card`
- `Skeleton`
- `EmptyState`

Defer `BottomSheet`, `Modal`, `Table`, and `Toast` until a later change unless implementation momentum clearly benefits from including them.

### 6. Validation Surface

Add a small showcase page or root placeholder section to visually validate:

- font pairing
- token usage
- hover/focus/disabled states
- spacing rhythm
- surface/background contrast

This should be implementation-oriented, not a polished marketing page.

## File/Module Intent

Expected structure for this change:

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── chip.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── skeleton.tsx
│       └── empty-state.tsx
└── lib/
    └── utils.ts
```

## Risks

### Tailwind v4 token mapping

Tailwind v4 has a different setup model than older versions. The implementation should keep the token source explicit in CSS so the project does not become tightly coupled to unstable theme wiring decisions.

### Overbuilding primitives

Trying to implement every component from the full product spec in milestone 1 would slow the project down and create unused abstractions. This change should focus on the primitives that are clearly needed next.

### Placeholder page scope creep

The validation surface should remain a theme smoke test. It should not become the homepage implementation from the storefront milestone.

## Open Questions Resolved By Assumption

- The repo should start from a clean Next.js scaffold because no existing app code is present.
- The first milestone should include a minimal preview surface so visual regressions can be checked early.
- The first implementation pass should prioritize core primitives only, with advanced overlays deferred.
