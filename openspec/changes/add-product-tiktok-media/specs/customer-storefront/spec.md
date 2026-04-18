# Customer Storefront Spec

## ADDED Requirements

### Requirement: Product cards must communicate when TikTok media is available

The storefront MUST indicate when a product has optional TikTok media without requiring customers to open the detail page first.

#### Scenario: A product card has TikTok media

- **WHEN** a customer views a product card for a product with TikTok media
- **THEN** the card communicates that a video or media preview is available
- **AND** the default image-first browsing experience remains intact
- **AND** the listing card does not depend on inline TikTok playback for the core browsing experience

### Requirement: Product media detail must prioritize TikTok when present

The storefront MUST place TikTok media before product images on the product detail page when the product has a configured TikTok URL.

#### Scenario: A customer opens a product with TikTok media

- **WHEN** the customer visits that product's detail page
- **THEN** the page renders video as the first media item in a unified product gallery
- **AND** the customer can browse left and right across video and images using one consistent media interaction model
- **AND** the remaining gallery images still remain available

#### Scenario: A customer chooses the video media item

- **WHEN** the customer selects the first media item representing TikTok video
- **THEN** the storefront opens playback in a controlled modal or equivalent playback surface
- **AND** the product gallery itself continues to behave like a marketplace media gallery rather than a TikTok-owned inline surface

#### Scenario: TikTok media is unavailable at render time

- **WHEN** the storefront cannot embed or preview the TikTok media successfully
- **THEN** the page preserves access to product images and the rest of the media gallery
- **AND** the customer still has a fallback path to the TikTok content
