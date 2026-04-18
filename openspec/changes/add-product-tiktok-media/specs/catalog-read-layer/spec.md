# Catalog Read Layer Spec

## ADDED Requirements

### Requirement: Product rows must support optional TikTok media links

The system MUST normalize an optional TikTok URL from product sheet rows so storefront and admin consumers can use a consistent field.

#### Scenario: A product row contains a TikTok URL

- **WHEN** the product row includes a supported `tiktok_url` value
- **THEN** the catalog read layer returns that value as normalized product media metadata
- **AND** consumers receive it through the product payload without additional sheet parsing

#### Scenario: A product row omits TikTok media

- **WHEN** the product row has an empty or missing `tiktok_url`
- **THEN** the normalized product returns no TikTok media value
- **AND** existing image-only rendering remains valid

### Requirement: Invalid TikTok values must be handled defensively

The system MUST reject or neutralize malformed TikTok values before they are exposed through typed product models.

#### Scenario: A product row contains an invalid TikTok value

- **WHEN** catalog normalization encounters a malformed or unsupported `tiktok_url`
- **THEN** the system handles the row defensively according to the validation policy
- **AND** downstream consumers are not forced to parse unsafe values themselves
