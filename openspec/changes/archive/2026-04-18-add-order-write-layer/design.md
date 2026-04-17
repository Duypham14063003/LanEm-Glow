# Design: Add Order Write Layer

## Overview

This change introduces the project's first backend write workflow. It turns the existing quick-order storefront flow into a real order-creation path backed by Google Sheets.

The design should keep the write-side logic encapsulated so later admin and notification work can reuse it instead of reconstructing business rules in route handlers.

## Write Path Architecture

```txt
QuickOrderSheet submit
        │
        ▼
POST /api/orders
        │
        ▼
orders service
        │
        ├── normalize phone
        ├── validate payload
        ├── re-check products / stock
        ├── detect duplicates
        ├── build order record
        └── append row to sheets
                │
                ▼
          orders sheet
```

## Key Decisions

### 1. Route Handlers Must Stay Thin

`POST /api/orders` should not contain business logic for duplicate checks, stock rules, or row-building. The route handler should parse the request, call the order service, and convert outcomes into HTTP responses.

### 2. Write Logic Must Re-Read Product State

The backend must not trust the client-selected product snapshot or earlier browse-time assumptions. It should re-check the selected products against the current catalog state before writing:

- product exists
- product is active
- product is not `out_of_stock`

Use a fresh or bypass-cache read path for this validation so stale catalog cache does not allow invalid orders through.

### 3. Duplicate Detection Should Produce Structured Outcomes

The schema already includes `duplicate_flag` and `status = duplicate`, so the write layer should treat duplicates as a recognized order outcome rather than silently ignoring them.

Recommended behavior for MVP:

- still write the duplicate record
- mark `status = duplicate`
- mark `duplicate_flag = true`
- return a structured response that reflects duplicate classification

### 4. Phone Must Be Normalized Server-Side

Client validation helps UX, but server-side normalization and validation remain mandatory. Phone numbers should be cleaned into a predictable local mobile format before duplicate checks and persistence.

### 5. Order Rows Must Include Product Snapshot Fields

The `orders` sheet should store not only selected product IDs but also a snapshot of selected product names. This reduces future dependency on mutable catalog state when admins inspect older orders.

## Expected Modules

```txt
src/
├── app/api/orders/route.ts
├── services/orders.ts
├── lib/
│   ├── sheets.ts          (append support)
│   └── validation.ts      (phone normalization / payload guards)
└── types/index.ts         (order payload/result types)
```

## Validation Rules

For order creation:

- `phone` is required after normalization
- selected product ids must be present
- every selected product must exist and be active
- no selected product may be `out_of_stock`
- request should fail clearly when configuration or sheet access is unavailable

## Duplicate Rule

Duplicate should be determined by:

- same normalized phone
- same selected product id set
- order created within `DUPLICATE_ORDER_WINDOW_MINUTES`

This is intentionally simple and auditable for MVP.

## Order Status Mapping

Suggested write outcomes:

- normal valid submission → `status = new`, `duplicate_flag = false`
- duplicate submission → `status = duplicate`, `duplicate_flag = true`
- invalid request → reject before write

## Frontend Integration

The quick-order sheet currently performs only local success handling. This change should update it to:

- submit to `POST /api/orders`
- show loading state while submitting
- only clear selected products after successful server response
- display friendly error feedback when the backend rejects the request

## Risks

### Stale reads during order creation

If the service validates selected products using stale cached catalog data, stock-state enforcement can become unreliable.

### Duplicate false positives

If duplicate matching is too broad, legitimate repeated orders could be mislabeled. Matching should be based on exact product-id-set equality, not partial overlap.

### Sheet write failures

Google Sheets append errors should surface as controlled server failures, not partial success in the UI.

## Assumptions

- The existing quick-order UI flow will stay in place and only be upgraded from local success handling to real submission handling.
- Google Sheets remains the source of truth for both catalog content and order storage in v1.
- Writing duplicate rows is acceptable because the schema explicitly models duplicate status and flags.
