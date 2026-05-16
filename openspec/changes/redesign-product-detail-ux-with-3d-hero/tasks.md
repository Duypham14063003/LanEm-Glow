## 1. Product Detail Layout Redesign

- [ ] 1.1 Restructure `src/app/(site)/products/[slug]/page.tsx` into a decision-first product detail layout with hero, summary, proof, gallery, and long-form content sections.
- [ ] 1.2 Introduce or update supporting storefront components for fit signals, trust cues, and top-of-page product guidance while preserving current quick-order actions.
- [ ] 1.3 Reposition TikTok proof so it is discoverable near the top of the product detail journey without breaking the existing gallery and modal behavior.

## 2. Immersive Hero Enhancement

- [ ] 2.1 Add the product-detail hero component structure with a static fallback path that works when rich rendering is unavailable.
- [ ] 2.2 If the selected implementation uses 3D, add and integrate the minimal `three` / React Three Fiber dependency stack in a narrowly scoped client component.
- [ ] 2.3 Implement reduced-motion and low-capability fallback behavior so hero effects never block pricing, actions, gallery, or TikTok proof content.

## 3. Media And Interaction Refinement

- [ ] 3.1 Refine `src/components/site/product-gallery.tsx` so gallery browsing remains coherent alongside the new hero and proof layout.
- [ ] 3.2 Update product-detail interaction copy, CTA grouping, and trust presentation to better support quick scanning on mobile and desktop.
- [ ] 3.3 Review analytics coverage for the redesigned product detail surface and add any missing engagement events needed for hero or proof interactions.

## 4. Verification

- [ ] 4.1 Add or update tests for product-detail rendering, TikTok proof behavior, and fallback states introduced by the redesign.
- [ ] 4.2 Verify `npm run type-check`, `npm run lint`, and `npm test`.
