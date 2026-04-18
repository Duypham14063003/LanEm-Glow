# Add Storefront Background

## Why

The storefront already has a soft gradient-based visual foundation, but it does not yet use the branded background artwork that now exists in `src/assets/background.png`.

Adding that asset carefully can make the customer-facing experience feel more polished and distinctive without changing the admin surfaces or disrupting readability for product content and calls to action.

## What Changes

- Apply the existing `src/assets/background.png` asset to the customer-facing storefront shell.
- Keep the background treatment scoped to public storefront routes rather than the admin panel.
- Layer the image with the existing light gradient and a soft overlay so text, cards, and quick-order controls remain readable.
- Preserve responsive behavior across mobile and desktop so the background feels intentional instead of stretched or distracting.

## Non-Goals

- Reworking the overall color system or typography
- Redesigning storefront sections or content hierarchy
- Applying the same background treatment to admin pages
- Introducing animation-heavy visual effects

## Scope Notes

This change should remain visually conservative: the background image is a supporting layer, not the main content. The implementation should prefer subtle opacity and composition choices over a loud hero-style treatment.

The background should integrate with the existing LanEm Glow aesthetic and continue to support fast scanning on mobile screens.

## Success Criteria

- Public storefront routes visibly use the provided background asset.
- The admin area keeps its current, cleaner backdrop treatment.
- Readability of headings, body copy, cards, and CTAs remains strong on top of the new background.
- The background presentation feels consistent on mobile and desktop layouts.
