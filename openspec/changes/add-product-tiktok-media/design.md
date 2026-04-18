# Design

## Overview

This change adds one optional media field to the product model and uses it in two storefront contexts:

- product cards
- product detail media gallery

It also extends the admin product editor so internal users can manage the field without leaving the application.

```text
products sheet
   └── tiktok_url (optional)
            │
            ▼
catalog normalization
   └── product.tiktokUrl
            │
            ├── admin products form
            │      └── read/write validation
            │
            ├── product card
            │      └── lightweight "has video" treatment
            │
            └── product detail gallery
                   ├── unified media carousel
                   ├── video poster first, images after
                   └── modal playback for TikTok
```

## Data Model

### New product field

The `products` sheet should add a new optional column:

- `tiktok_url`

Normalized product models should expose:

- `tiktokUrl: string | null`

Admin product mutation payloads should support:

- `tiktokUrl`

### Validation behavior

The system should treat TikTok media as optional:

- empty string becomes `null`
- missing sheet value becomes `null`
- admin validation should reject obviously malformed URLs

The initial validation target should be practical rather than exhaustive:

- accept TikTok URLs from standard share/profile video formats that can be stored as an external URL
- reject non-URL values or unsupported protocols

## Storefront Experience

### Product cards

Cards should remain image-first, but products with video should communicate that richer media exists.

Recommended behavior:

- keep the primary product image as the default visual
- if `tiktokUrl` exists, show a small video-related affordance such as badge, overlay label, or icon
- do not embed or autoplay TikTok in listing cards
- direct users toward the product detail page for the full media experience

To keep performance predictable:

- do not eagerly embed TikTok iframes for every card in a listing
- do not rely on hover-only interaction for understanding media availability
- mobile and desktop cards should behave consistently as teaser surfaces

### Product detail gallery

The detail page is the correct place for the full product media experience.

If `tiktokUrl` exists:

- place the TikTok media item first in the media sequence
- then render the product's main image and gallery images
- expose one unified left/right browsing pattern rather than stacking video and images as separate blocks

Recommended structure:

```text
Main media frame
├── media[0] = video poster
├── media[1] = main image
├── media[2..n] = gallery images
└── controls = swipe / arrows / thumbnails / dots

Selecting video poster
└── opens modal with TikTok playback
```

Why poster-first instead of inline iframe-first:

- a TikTok iframe can capture gestures and CTA behavior in ways that feel unlike a commerce gallery
- marketplace-style product media should preserve predictable left/right navigation
- the modal keeps TikTok playback available without letting the third-party surface dominate gallery interaction

If TikTok playback cannot be rendered or loaded:

- preserve a clear fallback link to open the TikTok content externally
- do not block the image gallery

## Embed Strategy

This change should favor resilient TikTok support over the most aggressive autoplay possible.

Recommended progression:

1. Normalize and store the external TikTok URL
2. Represent TikTok as the first media item in a unified gallery
3. Use a poster/teaser surface in the gallery itself
4. Open TikTok playback inside a modal or dedicated playback layer
5. Always keep an external-open fallback

This allows the storefront to feel closer to a marketplace product gallery:

- one hero frame
- left/right media browsing
- thumbnails or dots for quick jumps
- controlled playback when the user explicitly chooses video

## Admin Experience

The existing admin products workspace should gain one new field:

- TikTok URL

The field should:

- be optional
- preserve empty values cleanly
- return meaningful validation feedback when the URL is not acceptable

This keeps media management aligned with the existing sheet-backed editing flow.

## API And Service Impact

Affected areas:

- product normalization in the catalog read layer
- admin product normalization and persistence
- public catalog responses and product detail responses

No separate TikTok API endpoint is needed in this milestone. The existing product payloads can carry the new field.

## Risks

### Embed fragility

TikTok embeds are more fragile than static images and may behave differently across browsers or environments. The implementation should always support a fallback link and avoid making the gallery itself depend on successful embed initialization.

### Listing performance

Naively embedding video into every product card would make listing pages heavy. The design should keep listing pages image-first and teaser-only.

### Gesture ownership

Inline third-party iframes can interfere with swipe and pointer interactions. A modal playback step is the safest way to preserve left/right product media browsing.

### Sheet schema drift

The products sheet now carries another optional field. The normalization layer and admin writer must stay in sync so reads and writes preserve row structure safely.
