# Add Admin Product Image Upload

## Why

The admin products workspace currently requires operators to paste image URLs manually. That keeps the catalog functional, but it slows down product entry and makes the workflow less practical for non-technical users who simply want to upload product images from their machine.

Adding a dedicated image upload flow would make product creation and editing more complete without forcing a broader storage migration away from the current Google Sheets-based catalog model.

## What Changes

- Add an admin-side image upload flow for product images.
- Store uploaded image files in a runtime-safe public directory rather than under `src/`.
- Return a public URL that can be written into the existing product image fields.
- Integrate upload controls into the admin products form for both primary image and gallery image workflows.
- Add validation and failure handling for unsupported file types, oversized payloads, and failed writes.

## Non-Goals

- Migrating media to third-party cloud storage
- Backfilling existing product image URLs automatically
- Adding image transformations, optimization pipelines, or cropping tools
- General-purpose file management for the entire admin panel
- Storing uploaded files inside `src/` or other build-time source directories

## Scope Notes

This change should stay tightly scoped to product media upload inside the admin products workflow. The initial storage target can be `public/uploads/products`, which keeps the implementation simple and compatible with local or single-instance deployments.

The admin form should continue to support manual URL entry as a fallback, but upload should become the easiest path for primary image selection.

## Success Criteria

- Admin users can upload a product image directly from the products workspace.
- Uploaded files are stored in a runtime-safe public directory and exposed via a usable URL.
- The returned image URL can be applied to the product form without manual copy/paste gymnastics.
- Invalid or failed uploads show clear feedback in the admin UI.
- The implementation avoids writing user-uploaded files into `src/`.
