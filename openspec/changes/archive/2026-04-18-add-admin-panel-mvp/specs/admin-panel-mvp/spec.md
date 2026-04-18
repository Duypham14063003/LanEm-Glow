# Admin Panel MVP Spec

## ADDED Requirements

### Requirement: The application must provide a dedicated admin shell for internal order operations

The system MUST provide admin routes that render within a dedicated admin layout and navigation shell.

#### Scenario: Admin opens the orders workspace

- **WHEN** an internal user visits the admin area
- **THEN** the application renders an admin-specific layout
- **AND** the user can navigate to the orders workspace from the admin navigation

### Requirement: Admin users must be able to list and filter orders

The system MUST provide an internal orders listing experience backed by normalized order data from Google Sheets.

#### Scenario: Admin views the orders list

- **WHEN** the admin opens the orders page
- **THEN** the application shows orders sorted newest first
- **AND** the list includes operational summary fields needed for triage

#### Scenario: Admin searches and filters orders

- **WHEN** the admin applies search or filter inputs
- **THEN** the backend returns a filtered list using order id, phone, status, duplicate flag, or date range constraints

### Requirement: Admin users must be able to inspect full order details

The system MUST provide a detail surface for a selected order.

#### Scenario: Admin opens an order detail view

- **WHEN** the admin selects an order from the list
- **THEN** the application shows customer, selected product, source, duplicate, and notes data for that order

### Requirement: Admin users must be able to update operational order fields

The system MUST support admin-side updates for order status and internal notes.

#### Scenario: Admin updates an order status

- **WHEN** the admin submits a valid status change
- **THEN** the backend updates the matching order row in Google Sheets
- **AND** the response returns the normalized updated order

#### Scenario: Admin updates an internal note

- **WHEN** the admin saves an admin note
- **THEN** the backend persists the note to the matching order row

### Requirement: Admin orders flows must handle loading, empty, and failure states clearly

The admin experience MUST communicate operational states clearly.

#### Scenario: No orders match the current filters

- **WHEN** the admin applies a query with no matching rows
- **THEN** the application shows a friendly empty state
- **AND** the admin can reset or change filters

#### Scenario: Order update fails

- **WHEN** the backend rejects an update request
- **THEN** the admin UI shows a failure message
- **AND** the current selection is not silently lost
