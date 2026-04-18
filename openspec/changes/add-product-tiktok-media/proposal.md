# Add Product TikTok Media

## Why

The storefront currently treats products as image-only merchandise cards. That works for catalog browsing, but it misses a strong sales asset the brand already has: short-form TikTok content that shows texture, use case, and product context faster than static images alone.

This change introduces an optional TikTok media link per product so the storefront can surface richer product storytelling without forcing video onto every item.

The goal is to improve product exploration and confidence while keeping the experience lightweight, mobile-friendly, and operationally manageable from the existing Google Sheets and admin product workflows.

## What Changes

- Extend the product data model with an optional `tiktok_url` field sourced from the `products` sheet.
- Allow admins to view and edit the TikTok URL from the existing product management form.
- Keep storefront product cards lightweight by communicating that a video is available without trying to play TikTok inline from listing views.
- Replace the product detail media stack with a unified commerce-style gallery where video is represented as the first media item and customers can move left/right across media items like a marketplace product gallery.
- Open TikTok playback from a controlled modal or dedicated playback layer instead of forcing an inline TikTok iframe to own the primary gallery surface.
- Add validation and normalization rules so empty values remain safe and malformed values fail clearly in admin flows.

## Non-Goals

- Building a generic multi-video media management system
- Supporting arbitrary social platforms beyond TikTok in this milestone
- Guaranteeing autoplay behavior across all browsers and embed environments
- Building a full media management CMS with custom video hosting
- Tracking advanced video analytics beyond the existing lightweight storefront event model

## Scope Notes

This change should preserve the current Google Sheets-first workflow:

- the `products` sheet remains the source of truth
- TikTok media is optional per product
- products without a TikTok URL continue to render exactly as image-first products

The storefront experience should favor graceful degradation:

- listing cards should stay image-first and avoid heavy embedded playback
- mobile and desktop should share one understandable media browsing model on the detail page
- detail pages should remain functional if TikTok playback must fall back to opening externally

## Success Criteria

- Product records can store an optional TikTok URL end-to-end through the catalog read layer and admin product editor.
- Product cards visually indicate when a video exists without degrading products that only have images.
- Product detail pages expose a unified left/right media browsing experience where video is treated as the first product media item.
- TikTok playback is available from the product detail experience without forcing the gallery itself to behave like a TikTok-owned surface.
- Invalid or missing TikTok values are handled safely in admin validation and storefront rendering.
- The resulting experience feels additive and lightweight rather than intrusive or fragile.
