# Order Write Layer Spec

## ADDED Requirements

### Requirement: The system must accept quick-order submissions through an internal API

The application MUST provide a `POST /api/orders` endpoint for quick-order submission.

#### Scenario: Customer submits a quick order

- **WHEN** the quick-order form is submitted with valid data
- **THEN** the application processes the request through the internal orders API
- **AND** the backend returns a structured success response

### Requirement: Quick-order submissions must be validated on the server

The system MUST validate quick-order payloads on the server regardless of client-side validation.

#### Scenario: Submission contains invalid phone or no products

- **WHEN** the backend receives an invalid submission
- **THEN** the request is rejected
- **AND** no order row is written

#### Scenario: Submission contains out-of-stock or inactive products

- **WHEN** the backend re-checks selected products
- **THEN** invalid product selections are rejected before persistence

### Requirement: Valid quick orders must be persisted to the orders sheet

The system MUST append valid quick-order records to the `orders` Google Sheet using the defined orders schema.

#### Scenario: A valid order is created

- **WHEN** all validation checks pass
- **THEN** the backend appends a new row to the `orders` sheet
- **AND** the row contains product ids, product-name snapshot, customer details, and order metadata

### Requirement: Duplicate quick orders must be classified consistently

The system MUST detect duplicate quick orders using the configured duplicate window and classify them in persisted data.

#### Scenario: Same customer repeats the same product intent within the duplicate window

- **WHEN** the normalized phone number and selected product id set match a recent order
- **THEN** the new order is marked as duplicate
- **AND** the duplicate flag is persisted in the orders sheet

### Requirement: Quick-order UI must react to real backend outcomes

The storefront quick-order sheet MUST reflect actual backend submission success or failure instead of relying only on client-local success behavior.

#### Scenario: Backend order creation succeeds

- **WHEN** the orders API accepts the request
- **THEN** the quick-order UI shows a success state
- **AND** selected products are cleared only after success

#### Scenario: Backend order creation fails

- **WHEN** the orders API rejects the request
- **THEN** the quick-order UI shows an error state
- **AND** selected products are not cleared automatically
