# Customer Storefront Spec

## ADDED Requirements

### Requirement: Product cards must communicate when TikTok media is available

The storefront MUST indicate when a product has optional TikTok media without requiring customers to open the detail page first.

#### Scenario: A product card has TikTok media

- **WHEN** a customer views a product card for a product with TikTok media
- **THEN** the card communicates that a video or media preview is available
- **AND** the default image-first browsing experience remains intact

### Requirement: Product media detail must prioritize TikTok when present

The storefront MUST place TikTok media before product images on the product detail page when the product has a configured TikTok URL.

#### Scenario: A customer opens a product with TikTok media

- **WHEN** the customer visits that product's detail page
- **THEN** the page renders the TikTok media item ahead of the product image gallery
- **AND** the remaining gallery images still remain available

#### Scenario: TikTok media is unavailable at render time

- **WHEN** the storefront cannot embed or preview the TikTok media successfully
- **THEN** the page preserves access to product images
- **AND** the customer still has a fallback path to the TikTok content
