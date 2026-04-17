# Add Quick Order Flow

## Why

The storefront now supports browsing and inspecting products, but it still stops short of the low-friction conversion path described in the product specification. Customers can discover products, but they cannot yet mark products they want, see a sticky call-to-action on mobile, or open a quick order sheet to leave their phone number and order intent.

This milestone bridges the gap between browse UI and lead capture. It should introduce the shared selected-product state and the quick-order interaction model that later backend order-writing work can build on cleanly.

## What Changes

- Add a shared selected-product state for customer-facing storefront pages.
- Connect product selection behavior to listing cards and product detail calls to action.
- Add a mobile sticky quick-order bar that appears when at least one product is selected.
- Add a reusable bottom-sheet primitive suitable for quick-order and future mobile interactions.
- Add a `QuickOrderSheet` that:
  - shows selected products
  - allows removing selections
  - collects `phone`, optional `name`, and optional `note`
  - validates input before submission
- Add light client-side persistence so selected products survive navigation and refresh.

## Non-Goals

- Full order persistence and duplicate detection logic
- Google Sheets write-path implementation
- Admin order management updates
- Complex cart or quantity management
- Advanced coupon, pricing, or checkout behavior

## Scope Notes

This change is focused on the storefront conversion UI and interaction flow. It may prepare submission wiring, but the deeper backend write-path remains separable so milestone 5 can own persistence and order-processing rules.

## Success Criteria

- Customers can select and deselect products consistently across listing and detail pages.
- A sticky mobile CTA appears when at least one product is selected.
- Customers can open a quick-order sheet and review/remove selected products.
- The quick-order form validates the required phone field and basic storefront constraints.
- The quick-order interaction layer remains clearly separated from the later order persistence milestone.
