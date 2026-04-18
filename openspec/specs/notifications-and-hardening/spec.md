# Notifications And Hardening Spec

## ADDED Requirements

### Requirement: The system must notify admins about newly created orders

The application MUST attempt to notify the configured admin recipient when a new quick order is created successfully.

#### Scenario: New order triggers admin notification

- **WHEN** a quick-order request is accepted and persisted
- **THEN** the system attempts to send an admin notification email

#### Scenario: Notification delivery fails after a successful order write

- **WHEN** the order is persisted but email delivery fails
- **THEN** the order remains successful
- **AND** the notification failure is handled as a controlled degraded outcome

### Requirement: Public order submission must be protected from abuse

The application MUST rate limit public quick-order submissions.

#### Scenario: Client exceeds the allowed submission rate

- **WHEN** the same client submits too many order requests within the configured window
- **THEN** the API rejects the request with a rate-limit response

### Requirement: Order-related flows must handle failure and feedback states clearly

The application MUST provide clear UI and API outcomes for important operational states.

#### Scenario: Quick-order request is rate limited

- **WHEN** the user submits during a rate-limited window
- **THEN** the quick-order UI shows a specific failure message

#### Scenario: Admin updates or views orders during empty or failure conditions

- **WHEN** the admin workflow encounters empty, loading, or failed states
- **THEN** the admin UI communicates those states clearly instead of failing silently
