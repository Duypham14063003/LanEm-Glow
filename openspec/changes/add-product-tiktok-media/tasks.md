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
- [x] Add a lightweight hover-capable preview treatment that does not require eager embeds for all cards.
- [x] Update the product detail media presentation so TikTok media appears before product images.
- [x] Provide a graceful fallback when TikTok media cannot be embedded or previewed.

## 4. Verification

- [x] Add or update tests for product normalization, admin product mutation behavior, and storefront media rendering paths.
- [x] Verify `npm run type-check`, `npm run lint`, and `npm test`.
