# Tasks

## 1. Catalog Data Model

- [x] Add optional `tiktok_url` support to the raw product sheet schema and normalized product model.
- [x] Extend public catalog normalization so TikTok URLs are returned safely as `tiktokUrl`.
- [x] Add validation coverage for empty, valid, and invalid TikTok URL cases.

## 2. Admin Product Management

- [x] Add an optional TikTok URL field to the admin product editor.
- [x] Extend admin product create/update normalization to read and write the TikTok field.
- [x] Return clear validation errors when the admin submits an invalid TikTok URL.

## 3. Storefront Product Media

- [x] Update product cards to indicate when TikTok media is available.
- [ ] Replace any inline card preview treatment with a lightweight teaser-only treatment for TikTok-backed products.
- [ ] Rework the product detail media area into a unified left/right gallery pattern that treats video as the first media item.
- [ ] Add a video poster or media tile that opens TikTok playback in a controlled modal or playback layer.
- [ ] Keep graceful fallback behavior when TikTok playback cannot be embedded or must open externally.

## 4. Verification

- [ ] Add or update tests for product normalization, admin product mutation behavior, and storefront media rendering paths.
- [ ] Verify `npm run type-check`, `npm run lint`, and `npm test`.
