# Admin Panel MVP Spec

## ADDED Requirements

### Requirement: Admin product management must support image upload

The admin products workflow MUST support uploading product images directly from the admin interface.

#### Scenario: Admin uploads a primary product image

- **WHEN** the admin selects an image file in the product form
- **THEN** the application stores the file in a runtime-safe public upload location
- **AND** the upload flow returns a usable public URL for the product image field

### Requirement: Product image upload must avoid build-time source directories

The system MUST NOT store runtime-uploaded product images inside source-code directories such as `src/`.

#### Scenario: Admin submits an image upload

- **WHEN** the application persists the uploaded file
- **THEN** the file is written to a runtime-safe upload directory
- **AND** the implementation does not require modifying build-time source assets

### Requirement: Admin image upload failures must be communicated clearly

The admin image upload flow MUST provide clear feedback when an upload cannot be completed.

#### Scenario: Upload fails validation

- **WHEN** the admin submits an unsupported or invalid file
- **THEN** the UI shows a meaningful upload error
- **AND** the rest of the product form remains usable
