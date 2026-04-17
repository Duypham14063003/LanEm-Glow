# Bootstrap Theme Foundation

## Why

The project currently contains only product and business documentation. There is no application scaffold, design token system, or shared UI layer to support the storefront and admin experiences described in `SPEC.vi.md`.

Milestone 1 needs a clear implementation contract so later milestones can build on a consistent base instead of re-deciding fonts, colors, spacing, and primitive component behavior page by page.

## What Changes

- Create the initial Next.js 15 application foundation with App Router, TypeScript, and Tailwind CSS v4.
- Establish global styling primitives, including font loading, typography scale, color tokens, spacing, radius, elevation, and motion tokens.
- Define the shared UI primitive layer for the first reusable components:
  - `Button`
  - `Input`
  - `Textarea`
  - `Chip`
  - `Badge`
  - `Card`
  - `Skeleton`
  - `EmptyState`
- Introduce a small utility layer for class composition and shared layout wrappers needed by future milestones.
- Add a lightweight visual validation surface to confirm the theme and primitives render correctly before feature pages are built.

## Non-Goals

- Product catalog integration
- Google Sheets connectivity
- Search, filter, and quick order behavior
- Admin workflows and data tables
- Notification, analytics, or SEO implementation

## Scope Notes

This change is intentionally limited to platform and design foundation work. It should produce a usable shell that future changes can extend without reworking global theming decisions.

## Success Criteria

- A fresh contributor can run the project and see a themed Next.js application shell.
- Global tokens match the product specification for typography, color, spacing, radius, and motion.
- Shared primitives are implemented with consistent variants and accessible default states.
- The implementation is structured so future storefront and admin work can reuse the same UI system without duplication.
