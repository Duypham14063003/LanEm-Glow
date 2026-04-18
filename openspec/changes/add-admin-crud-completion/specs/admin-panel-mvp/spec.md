# Admin Panel MVP Spec

## ADDED Requirements

### Requirement: Admin users must be able to archive products without deleting catalog history

The admin products workflow MUST support a non-destructive archive action for catalog items.

#### Scenario: Admin archives a product

- **WHEN** the admin archives a product from the admin workspace
- **THEN** the backend updates the product status to an inactive state
- **AND** the original product row remains in Google Sheets

### Requirement: Admin users must be able to create orders manually

The admin workspace MUST support creating a new order record directly from the internal UI.

#### Scenario: Admin submits a valid manual order

- **WHEN** the admin submits a valid internal order form
- **THEN** the backend records a new order row using the project order write rules
- **AND** the admin receives a normalized order response

### Requirement: Admin order delete semantics must preserve operational history

The admin orders workflow MUST avoid hard-deleting rows for normal archive/cancel actions.

#### Scenario: Admin archives or cancels an order

- **WHEN** the admin performs an order removal-like action
- **THEN** the system preserves the underlying order row
- **AND** the order lifecycle is represented through retained-record status changes

### Requirement: Admin users must be able to manage known storefront settings

The admin workspace MUST provide an editable fixed-field settings experience for the storefront settings used by the public site.

#### Scenario: Admin opens the settings workspace

- **WHEN** the admin visits the settings page
- **THEN** the application renders the known storefront settings fields instead of a placeholder

#### Scenario: Admin saves storefront settings

- **WHEN** the admin submits valid settings changes
- **THEN** the backend updates or upserts the known settings keys in the `settings` Google Sheet
- **AND** subsequent public settings reads can observe the updated values promptly
