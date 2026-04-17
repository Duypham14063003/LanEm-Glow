# Tasks

## 1. Project Scaffold

- [x] Initialize the project with Next.js 15, App Router, TypeScript, and Tailwind CSS v4.
- [x] Create the base `src/` structure from the technical spec.
- [x] Add essential dependencies for class composition and icon usage where needed by the primitive layer.

## 2. Global Theme System

- [x] Configure root layout and global stylesheet.
- [x] Load `Cormorant Garamond` and `Be Vietnam Pro` through Next.js.
- [x] Define CSS custom properties for color, typography, spacing, radius, shadow, and motion tokens.
- [x] Apply sensible base styles for `body`, headings, links, inputs, and selection state.

## 3. Shared Utilities

- [x] Add a `cn()`-style utility for composing classes safely.
- [x] Define any minimal variant or helper patterns required by the first primitive set.

## 4. UI Primitives

- [x] Implement `Button` with primary, secondary, ghost, and danger variants plus disabled/loading states.
- [x] Implement `Input` and `Textarea` with default, focus, error, and disabled states.
- [x] Implement `Chip`, `Badge`, and `Card` with states aligned to the product spec.
- [x] Implement `Skeleton` and `EmptyState` for loading and empty content placeholders.

## 5. Theme Validation Surface

- [x] Create a lightweight page or section that renders the primitive set for visual verification.
- [x] Confirm the rendered UI matches the intended LanEm Glow tone: soft, premium, calm, and conversion-friendly.

## 6. Quality Checks

- [ ] Verify the app runs locally without configuration errors.
- [ ] Verify responsive behavior for the primitive preview surface.
- [ ] Verify interactive states are keyboard-accessible and visually consistent.

## Notes

- Runtime verification currently requires Node 20 because the chosen Next.js 15 + Tailwind CSS v4 stack does not run cleanly on the machine's active Node 18.16.0 environment.
