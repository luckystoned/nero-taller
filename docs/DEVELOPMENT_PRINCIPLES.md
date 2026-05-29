# Development Principles

## General Rule

Build only what is required now.

Avoid future-proofing beyond the documented architecture.

---

## Development Order

Each feature should be implemented in this order:

1. Domain Model
2. Prisma Schema
3. Zod Validation
4. Service Layer
5. Queries
6. Actions
7. UI Components

---

## Component Rules

React components should:

- Render data
- Trigger actions

React components should NOT:

- Contain business logic
- Access Prisma directly
- Implement workflows

---

## Services

All business logic belongs in Services.

Examples:

- Create Work Order
- Approve Quote
- Change Work Order Status
- Generate Vehicle History

---

## Database Access

Use Prisma for all data access.

Avoid raw SQL unless analytical queries require it.

---

## Validation

Every input must be validated with Zod.

No exceptions.

---

## Feature Isolation

Each feature owns:

- Components
- Services
- Queries
- Schemas
- Types

Avoid cross-feature coupling.