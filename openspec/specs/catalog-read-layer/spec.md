# Catalog Read Layer Spec

## ADDED Requirements

### Requirement: The application must read catalog data through a server-side Sheets integration

The system MUST read catalog and public settings data from Google Sheets on the server and MUST NOT expose direct Sheets access to the browser.

#### Scenario: Storefront requests the product catalog

- **WHEN** the storefront needs catalog data
- **THEN** the server reads data from the configured `products` sheet through an internal integration layer
- **AND** the browser receives only normalized JSON from internal APIs

### Requirement: Product rows must be normalized before use

The system MUST convert raw product sheet rows into typed product objects before they are used by services or returned by APIs.

#### Scenario: A raw product row contains mixed value types

- **WHEN** a product row is read from Google Sheets
- **THEN** numbers, booleans, delimited fields, and optional values are normalized into predictable types
- **AND** invalid or missing required fields are handled defensively

### Requirement: Public catalog APIs must expose only active products

The public catalog API MUST exclude inactive products from listing and detail responses.

#### Scenario: A product is marked inactive in the sheet

- **WHEN** the catalog listing API is requested
- **THEN** products with `status = inactive` are omitted

#### Scenario: A slug points to an inactive or missing product

- **WHEN** the product detail API is requested with that slug
- **THEN** the response is `404`

### Requirement: Product listing API must support core catalog filters

The public product listing API MUST support the core read filters defined by the product specification.

#### Scenario: A user searches the catalog

- **WHEN** the listing API receives a text query
- **THEN** matching considers product name, category, concern, and search keywords

#### Scenario: A user filters by concern or stock state

- **WHEN** the listing API receives supported filter parameters
- **THEN** the API returns only products matching those normalized criteria

### Requirement: Catalog reads must use server-side caching

The system MUST cache catalog reads on the server for a configurable TTL to reduce unnecessary Google Sheets API calls.

#### Scenario: Repeated catalog requests occur within the TTL window

- **WHEN** the same catalog data is requested repeatedly
- **THEN** the service serves cached normalized data until the TTL expires

### Requirement: Public settings must be exposed through a safe typed API

The system MUST expose storefront-safe public settings through an internal API instead of returning arbitrary sheet key-value pairs directly.

#### Scenario: Storefront requests public settings

- **WHEN** the settings API is called
- **THEN** the response contains only the supported public settings fields in normalized JSON form

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
