# Quick Order Flow Spec

## ADDED Requirements

### Requirement: Storefront pages must share selected-product state

The storefront MUST provide a shared selected-product state across customer-facing pages so product selection remains consistent across listing and detail routes.

#### Scenario: A customer selects a product in the listing

- **WHEN** the customer selects a product from a listing card
- **THEN** the product becomes selected in the shared storefront state
- **AND** other storefront surfaces can reflect that selected state

#### Scenario: A customer visits the detail page for a selected product

- **WHEN** the customer opens the detail page for a selected product
- **THEN** the primary CTA reflects that the product is already selected

### Requirement: The storefront must provide a sticky mobile quick-order bar

The storefront MUST display a sticky quick-order call-to-action on mobile when at least one product has been selected.

#### Scenario: One or more products are selected

- **WHEN** the selected-product count becomes greater than zero
- **THEN** a sticky mobile action bar appears
- **AND** the bar summarizes the selected state and offers a quick-order entry point

### Requirement: The storefront must provide a quick-order sheet

The storefront MUST provide a bottom-sheet quick-order experience for reviewing selected products and collecting lead information.

#### Scenario: A customer opens the quick-order flow

- **WHEN** the customer opens quick order from the sticky bar or a supported CTA
- **THEN** the sheet shows selected products
- **AND** the customer can remove products before continuing
- **AND** the sheet provides inputs for phone, optional name, and optional note

### Requirement: Quick-order form must validate core client-side constraints

The quick-order form MUST validate the required phone field and reject clearly invalid quick-order attempts before submission.

#### Scenario: Customer submits without phone number

- **WHEN** the customer tries to submit an empty phone field
- **THEN** the form blocks submission and shows a validation error

#### Scenario: Customer submits with no selected products

- **WHEN** the quick-order flow has no selected products
- **THEN** submission is blocked

### Requirement: Quick-order flow must stay decoupled from full checkout behavior

The quick-order flow MUST remain a lightweight lead-capture flow rather than a full cart or checkout system.

#### Scenario: Milestone 4 quick order is implemented

- **WHEN** customers use quick order
- **THEN** they can express order intent with selected products and contact details
- **AND** the system does not require quantity management, payment, or full checkout semantics
