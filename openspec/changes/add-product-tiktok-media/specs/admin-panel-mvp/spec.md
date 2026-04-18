# Admin Panel MVP Spec

## ADDED Requirements

### Requirement: Admin users must be able to manage optional TikTok media for products

The admin product editor MUST support viewing and editing an optional TikTok URL alongside the rest of the product catalog fields.

#### Scenario: Admin saves a product with TikTok media

- **WHEN** the admin submits a valid TikTok URL in the product editor
- **THEN** the backend persists the URL in the `products` Google Sheet
- **AND** the normalized product response includes the saved TikTok media value

#### Scenario: Admin clears TikTok media from a product

- **WHEN** the admin removes the TikTok URL and saves the product
- **THEN** the backend persists an empty TikTok media value safely
- **AND** the product continues to behave as an image-only product

#### Scenario: Admin submits an invalid TikTok URL

- **WHEN** the admin submits an unsupported or malformed TikTok value
- **THEN** the backend rejects the save with a clear validation error
- **AND** the current form input is preserved for correction
