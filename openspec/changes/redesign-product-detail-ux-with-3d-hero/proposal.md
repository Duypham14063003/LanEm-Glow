## Why

The current product detail page is functional but still too flat for a beauty storefront that needs to build confidence quickly on mobile. It shows product information and media, but it does not yet create a strong "understand this product fast, then act" flow that combines immersive presentation, social proof, and clear purchase-oriented guidance.

## What Changes

- Redesign the storefront product detail experience around a clearer decision-first UX hierarchy for mobile and desktop.
- Add an optional immersive 3D hero treatment that enhances the first-screen product impression without replacing the existing commerce gallery.
- Reorganize product detail content into faster-scanning sections such as core promise, fit signals, usage guidance, and social proof.
- Elevate TikTok media from a hidden optional asset into a clearer proof layer within the detail-page journey.
- Preserve graceful fallbacks so products remain fully usable when 3D rendering or richer media cannot load.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `customer-storefront`: Update product detail requirements to support an immersive hero treatment, stronger UX-oriented information hierarchy, clearer TikTok proof surfaces, and resilient fallback behavior across devices.

## Impact

- Affected code: `src/app/(site)/products/[slug]/page.tsx`, `src/components/site/product-gallery.tsx`, `src/components/site/product-detail-actions.tsx`, related storefront primitives and layout sections.
- Dependencies: likely adds `three`, `@react-three/fiber`, and `@react-three/drei` or an equivalent lightweight 3D rendering stack.
- Systems: storefront rendering, mobile interaction flow, media presentation, analytics events for richer product-detail engagement.
