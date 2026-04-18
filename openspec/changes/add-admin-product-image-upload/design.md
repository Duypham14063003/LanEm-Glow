# Design

## Overview

This change adds file upload support to the admin products workflow while preserving the existing data model:

- product records still store image URLs
- Google Sheets remains the product source of truth
- uploaded files are stored on disk in a public runtime directory

The core idea is:

```text
Admin form
└── upload file
    └── admin upload API
        ├── validate file metadata
        ├── persist file under public/uploads/products
        └── return public URL
            └── admin product form writes URL into image fields
```

## Why Not `src/`

User uploads should not be written into `src/` because `src/` is part of the application source tree and build input. Runtime uploads belong in a writable runtime location.

For this project, the initial safe target is:

- `public/uploads/products`

This gives the app a stable public URL shape such as:

- `/uploads/products/<generated-file-name>.jpg`

## Storage Strategy

The implementation should:

- ensure the upload directory exists before writing
- generate collision-resistant filenames
- preserve a safe file extension derived from the uploaded file type or original name
- avoid trusting the user filename blindly

Recommended naming pattern:

- `<timestamp>-<random-suffix>.<ext>`

## Validation

The upload endpoint should reject clearly invalid inputs.

Recommended initial constraints:

- image mime types only
- conservative max file size
- single file per request

If the request fails validation, return a clear error payload that the admin UI can show inline.

## API Shape

Recommended endpoint:

- `POST /api/admin/uploads/product-image`

Response shape:

- `url`
- `fileName`

Failure cases:

- missing file
- unsupported file type
- payload too large
- disk write failure

## Admin UI Integration

The product form should keep manual URL fields, but add an upload affordance near:

- primary `imageUrl`
- optionally gallery image entry flow

The MVP can upload one file at a time and then:

- insert the uploaded URL into the main image field
- or append the uploaded URL into the gallery field

## Risks

### Local filesystem dependence

This approach is simple and practical, but it assumes a writable filesystem. It is best suited to local development and basic single-instance hosting.

### File growth

Uploaded files will accumulate over time. This change does not yet include asset cleanup or replacement lifecycle management.

### Future storage migration

If the project later moves to cloud storage, the upload service should be isolated so the UI can keep the same interaction model with a different backend target.
