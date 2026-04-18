# Tasks

## 1. Upload Storage Foundation

- [x] Add a runtime-safe upload target under `public/uploads/products`.
- [x] Add helpers to validate image uploads and generate safe filenames.
- [x] Add controlled error handling for invalid files and failed writes.

## 2. Admin Upload API

- [x] Implement `POST /api/admin/uploads/product-image`.
- [x] Return a normalized payload with the uploaded public URL.
- [x] Reject unsupported file types, missing files, and oversized uploads with clear errors.

## 3. Admin Products UI Integration

- [x] Add an upload control for the primary product image field.
- [x] Add a lightweight workflow to append uploaded URLs into the gallery field.
- [x] Show upload progress, success feedback, and failure feedback in the admin form.

## 4. Verification

- [x] Add tests for upload validation or upload API behavior where practical.
- [x] Verify lint, type-check, and test suite pass.
