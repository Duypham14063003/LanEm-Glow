# Admin Panel MVP Spec

## ADDED Requirements

### Requirement: Admin users must be able to browse the product catalog in the admin panel

The system MUST provide an internal products workspace that lists catalog items using the existing Google Sheets-backed product source.

#### Scenario: Admin opens the products workspace

- **WHEN** an internal user visits the admin products route
- **THEN** the application renders a real product management workspace instead of a placeholder
- **AND** the workspace shows product records with operational summary fields

### Requirement: Admin users must be able to create products from the admin panel

The system MUST support creating a new product row through the admin experience while preserving the existing catalog sheet schema.

#### Scenario: Admin submits a valid new product

- **WHEN** the admin submits a valid product payload
- **THEN** the backend appends a new row to the `products` Google Sheet
- **AND** the response returns the normalized created product

#### Scenario: Admin submits a duplicate identity

- **WHEN** the admin submits a `product_id` or `slug` that already exists
- **THEN** the backend rejects the request with a clear duplicate error

### Requirement: Admin users must be able to update existing products from the admin panel

The system MUST support updating mutable product fields through the admin experience.

#### Scenario: Admin edits an existing product

- **WHEN** the admin saves changes for an existing product
- **THEN** the backend updates the matching `products` sheet row identified by `product_id`
- **AND** immutable identity handling remains consistent with the product design

### Requirement: Admin product writes must refresh catalog availability promptly

Successful admin-side product writes MUST invalidate relevant catalog cache entries so public catalog reads can pick up fresh data promptly.

#### Scenario: Admin saves a product change

- **WHEN** a product create or update operation succeeds
- **THEN** the application invalidates the relevant catalog cache entries
- **AND** subsequent catalog reads are not forced to wait for the full cache TTL

### Requirement: Admin product management must communicate validation and save failures clearly

The admin product workflow MUST show clear outcomes when validation fails or a save cannot be completed.

#### Scenario: Product save fails

- **WHEN** the backend rejects a create or update request
- **THEN** the admin UI shows a meaningful error state
- **AND** the current form input is not silently discarded
