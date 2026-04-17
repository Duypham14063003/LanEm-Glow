# Tasks

## 1. Shared Selection State

- [x] Add a selected-product store/provider available across customer storefront routes.
- [x] Implement add/remove/toggle/clear helpers and `isSelected` checks.
- [x] Add lightweight persistence so selections survive page navigation and refresh.

## 2. Bottom Sheet Foundation

- [x] Implement a reusable `BottomSheet` primitive for mobile-first interactions.
- [x] Ensure open/close behavior is accessible and visually aligned with the product spec.
- [x] Keep motion subtle and fast to match the quick-order interaction philosophy.

## 3. Quick Order Surfaces

- [x] Implement `QuickOrderBar` for mobile sticky CTA behavior.
- [x] Implement `QuickOrderSheet` with selected item summary and removal controls.
- [x] Render the quick-order surfaces from the shared site-level boundary.

## 4. Storefront CTA Integration

- [x] Connect product listing cards to shared selection state.
- [x] Connect homepage featured cards to shared selection state.
- [x] Connect product detail primary CTA to select/deselect behavior.
- [x] Connect product detail secondary CTA to opening the quick-order sheet.

## 5. Validation Form

- [x] Add the quick-order form fields for phone, optional name, and optional note.
- [x] Validate required phone and basic storefront constraints client-side.
- [x] Prevent invalid submission when no products are selected or the form is invalid.
- [x] Add a lightweight success-ready or submit-ready state without forcing full milestone 5 persistence logic.

## 6. Verification

- [x] Verify selection state stays consistent across listing/detail navigation.
- [x] Verify sticky quick-order bar visibility rules on mobile-oriented rendering.
- [x] Verify lint and type-check pass.
- [x] Verify tests cover selection or validation behavior for the new quick-order flow.
