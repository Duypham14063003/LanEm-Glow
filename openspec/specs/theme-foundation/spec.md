# Theme Foundation Spec

## ADDED Requirements

### Requirement: Application foundation must exist before feature milestones

The project MUST provide a runnable Next.js 15 application foundation using the App Router and TypeScript before storefront, data, or admin milestones are implemented.

#### Scenario: Contributor starts the project

- **WHEN** a contributor installs dependencies and starts the app
- **THEN** the project provides a valid Next.js application shell
- **AND** the shell uses the `src/`-based structure defined for the product
- **AND** the root layout loads the shared global theme

### Requirement: Global theme tokens must encode the LanEm Glow visual system

The application MUST define global design tokens for the brand visual system so all future interfaces use the same foundation.

#### Scenario: Shared tokens are consumed by UI components

- **WHEN** a component needs brand styling
- **THEN** it reads from globally defined tokens for color, typography, spacing, radius, elevation, and motion
- **AND** those tokens reflect the visual values described in the product specification

### Requirement: Brand typography must be applied consistently

The application MUST provide shared heading and body typography using the approved font pairing.

#### Scenario: A page renders headings and body copy

- **WHEN** headings and paragraph text appear in the application
- **THEN** headings use `Cormorant Garamond`
- **AND** body text uses `Be Vietnam Pro`
- **AND** the typography scale supports the sizes defined in the product specification

### Requirement: Core UI primitives must be reusable and stateful

The project MUST provide reusable UI primitives for early feature development with consistent visual and interaction states.

#### Scenario: A feature composes the shared primitive layer

- **WHEN** a developer builds a page using shared primitives
- **THEN** the project exposes reusable `Button`, `Input`, `Textarea`, `Chip`, `Badge`, `Card`, `Skeleton`, and `EmptyState` components
- **AND** each primitive supports the states required by the product specification or milestone scope

### Requirement: Theme validation must be visible in the running app

The project MUST include a lightweight validation surface that demonstrates the theme foundation in the browser.

#### Scenario: Theme review before feature work

- **WHEN** the app is opened during milestone 1
- **THEN** reviewers can inspect the active typography, color system, spacing rhythm, and primitive states without needing later milestone pages
