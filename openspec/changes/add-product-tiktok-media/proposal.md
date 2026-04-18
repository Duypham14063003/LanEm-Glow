# Add Product TikTok Media

## Why

The storefront currently treats products as image-only merchandise cards. That works for catalog browsing, but it misses a strong sales asset the brand already has: short-form TikTok content that shows texture, use case, and product context faster than static images alone.

This change introduces an optional TikTok media link per product so the storefront can surface richer product storytelling without forcing video onto every item.

The goal is to improve product exploration and confidence while keeping the experience lightweight, mobile-friendly, and operationally manageable from the existing Google Sheets and admin product workflows.

## What Changes

- Extend the product data model with an optional `tiktok_url` field sourced from the `products` sheet.
- Allow admins to view and edit the TikTok URL from the existing product management form.
- Update storefront product cards so products with TikTok media communicate that a video is available and can reveal a lightweight preview-oriented treatment on hover-capable devices.
- Update the product detail media gallery so TikTok content appears before product images when present.
- Add validation and normalization rules so empty values remain safe and malformed values fail clearly in admin flows.

## Non-Goals

- Building a generic multi-video media management system
- Supporting arbitrary social platforms beyond TikTok in this milestone
- Guaranteeing autoplay behavior across all browsers and embed environments
- Replacing the image gallery with a fully interactive carousel engine
- Tracking advanced video analytics beyond the existing lightweight storefront event model

## Scope Notes

This change should preserve the current Google Sheets-first workflow:

- the `products` sheet remains the source of truth
- TikTok media is optional per product
- products without a TikTok URL continue to render exactly as image-first products

The storefront experience should favor graceful degradation:

- desktop cards can expose richer hover affordances
- mobile should not rely on hover
- detail pages should remain functional if a TikTok embed cannot be rendered

## Success Criteria

- Product records can store an optional TikTok URL end-to-end through the catalog read layer and admin product editor.
- Product cards visually indicate when a video exists without degrading products that only have images.
- Product detail pages place TikTok media ahead of gallery images when a valid TikTok URL exists.
- Invalid or missing TikTok values are handled safely in admin validation and storefront rendering.
- The resulting experience feels additive and lightweight rather than intrusive or fragile.
