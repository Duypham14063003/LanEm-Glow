## Context

The current product detail page already supports a unified image and TikTok media gallery, product summary, concern chips, and quick-order actions. That gives the storefront a functional commerce baseline, but the page still behaves like a conventional content block stack rather than a guided decision surface for a beauty product.

This change introduces a richer first impression and a clearer information hierarchy without discarding the existing gallery or quick-order flow. The implementation needs to work especially well on mobile, where performance and vertical scanning speed matter more than visual novelty. The current codebase does not yet include any 3D runtime, so introducing immersive media is both a UI redesign and a dependency decision.

## Goals / Non-Goals

**Goals:**
- Create a product detail layout that helps customers understand the product and act faster on the first screen.
- Add an optional 3D hero treatment that reinforces product mood and form without owning the full media experience.
- Surface TikTok media as a clearer proof element in the detail-page journey.
- Keep the experience resilient when 3D, motion, or TikTok playback is unavailable.
- Preserve compatibility with the existing selected-product and quick-order behaviors.

**Non-Goals:**
- Building a generic 3D asset management system for every product.
- Replacing the current gallery with a full-screen 3D viewer.
- Introducing a complex CMS workflow for 3D models in this milestone.
- Redesigning the full storefront listing or homepage in the same change.

## Decisions

### 1. Treat the 3D hero as progressive enhancement, not primary product media

The hero area will support a lightweight immersive treatment that sits above or beside the summary content. The current gallery remains the primary detailed inspection surface because it already fits commerce expectations and works with TikTok media.

Why this approach:
- It keeps conversion-oriented content visible immediately.
- It avoids forcing every customer into a high-JS rendering path.
- It preserves a clear fallback if 3D is disabled, unsupported, or too expensive on mobile.

Alternative considered:
- Making 3D the first item in the existing gallery. Rejected because it complicates gallery controls, weakens predictability, and gives too much interaction ownership to a non-essential feature.

### 2. Keep TikTok as proof content near the hero and gallery, not hidden deep in the page

TikTok should move from being only a gallery item into a clearer proof surface near the top of the page. The design should still allow modal playback and external fallback, but discovery should happen earlier in the journey.

Why this approach:
- TikTok is stronger as social proof than as a hidden media type.
- Customers need to see that "real use / real texture" content exists before reading long descriptions.
- It aligns with a decision-first mobile flow.

Alternative considered:
- Keeping TikTok exclusively inside the gallery carousel. Rejected because it makes proof content too easy to miss.

### 3. Recompose the product detail page into decision-first sections

The page structure should shift toward:

```text
Hero / fallback visual
Core summary + price + primary actions
Fit signals / usage cues / trust points
TikTok proof block
Detailed gallery
Long-form description
Related or supporting content
```

Why this approach:
- It matches how customers scan on mobile.
- It separates "should I care?" from "tell me everything."
- It reduces the current dependence on the long description block to carry product understanding.

Alternative considered:
- Keeping the existing two-block layout and only polishing styles. Rejected because the current issue is hierarchy, not just appearance.

### 4. Use a lightweight React Three Fiber stack only for supported hero variants

If the implementation uses 3D, it should use `three` with `@react-three/fiber` and `@react-three/drei` in a narrowly scoped client component. The rest of the product detail page should remain server-rendered where practical.

Why this approach:
- The stack is mature enough for a small hero scene.
- It isolates the heavier client-side rendering to a specific surface.
- It fits the existing Next.js architecture without forcing the whole page client-side.

Alternative considered:
- Custom raw Three.js integration. Rejected because it increases implementation overhead for little benefit at this scope.

### 5. Define fallback strategy up front

The immersive hero needs built-in degradation rules:
- reduce or disable motion when `prefers-reduced-motion` applies
- fall back to a branded static visual on low-capability clients
- never block price, actions, gallery, or TikTok proof from rendering

Why this approach:
- Reliability matters more than effect fidelity on a storefront PDP.
- It keeps the change safe for a broad device range.

## Risks / Trade-offs

- [3D payload and runtime cost] → Keep the 3D scene narrowly scoped, lazy-load the client component, and provide a static fallback.
- [TikTok plus 3D could create a noisy first screen] → Separate roles clearly: 3D for mood and form, TikTok for proof, gallery for inspection.
- [Design drift from existing storefront patterns] → Reuse current tokens, card language, spacing system, and CTA conventions instead of introducing a disconnected visual style.
- [Limited data model for hero variants] → Start with code-driven or per-product conditional hero treatment before introducing a persistent `modelUrl` field.

## Migration Plan

1. Add the new product-detail layout and hero components behind the existing product detail route.
2. Introduce 3D dependencies only if the hero variant selected for implementation requires them.
3. Preserve the current gallery and TikTok modal behavior while moving proof surfaces higher in the page.
4. Validate mobile behavior, reduced-motion fallback, and degraded media states before rollout.

Rollback strategy:
- Remove or disable the immersive hero component and retain the redesigned static layout.
- If needed, restore the previous gallery-first layout without affecting catalog data or admin workflows.

## Open Questions

- Should the first release support 3D on every product detail page or only on featured products?
- Do we want product-level configuration for hero variant selection now, or should the first pass stay code-driven?
- Should TikTok proof appear as an inline section, a compact card near the summary, or both depending on viewport?
