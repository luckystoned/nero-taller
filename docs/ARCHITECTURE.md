# Nero Automotive CRM

# Functional Architecture & Domain Model

## Architecture Goal

Design an intelligent workshop management platform for a single automotive repair shop.

The system manages:

- Customers
- Companies
- Vehicles
- Work Orders
- Quotes
- Approvals
- Parts
- Suppliers
- Attachments
- Vehicle history
- QR public history
- WhatsApp messaging
- Dashboard
- AI Assistant

---

## Technology Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js Route Handlers
- Server Actions

### Database

- Supabase PostgreSQL
- Prisma ORM

### Storage

- Supabase Storage

### Authentication

- Supabase Auth

### AI

- OpenAI Responses API
- OpenAI Vector Store

### Deployment

- Vercel

---

## Core Architectural Principle

The platform separates knowledge into three categories:

### Structured Workshop Data

Stored in PostgreSQL.

Examples:

- Work Orders
- Vehicles
- Customers
- Suppliers
- Costs

Accessed through SQL tools.

---

### Mechanical Knowledge

Provided by OpenAI models.

Examples:

- Diagnostics
- Troubleshooting
- Mechanical explanations

---

### Private Documents

Stored in OpenAI Vector Store.

Examples:

- Manuals
- Internal procedures
- Supplier documentation

---

## Important Rule

Workshop operational history is NOT stored in embeddings.

Work Orders remain in PostgreSQL.

SQL is the primary source of truth.

---

# Bounded Contexts

## Identity & Access

Responsibilities:

- Users
- Authentication
- Sessions

---

## Customers

Responsibilities:

- Individual customers
- Company customers

---

## Vehicles

Responsibilities:

- Vehicle registry
- Vehicle history
- Public QR access

---

## Work Orders

Responsibilities:

- Intake
- Diagnostics
- Repair lifecycle
- Delivery

---

## Quotes & Approvals

Responsibilities:

- Quotes
- Approval workflow

---

## Parts & Suppliers

Responsibilities:

- Parts
- Suppliers
- Purchase history

---

## Attachments

Responsibilities:

- Photos
- PDFs
- Invoices

---

## Messaging

Responsibilities:

- WhatsApp notifications
- Delivery logs

---

## Public Vehicle History

Responsibilities:

- Public QR history
- Safe information exposure

---

## Analytics

Responsibilities:

- Operational metrics
- Financial metrics

---

## AI Assistant

Responsibilities:

- SQL queries
- Mechanical assistance
- Mixed-context questions
- Diagnostic suggestions

---

# Domain Rules

## Rule 1

Every Work Order must belong to a Vehicle.

---

## Rule 2

A Work Order belongs to either:

- Customer
OR
- Company

Never both.

---

## Rule 3

Companies may require approval.

If approval is required:

Work Order must enter:

WAITING_COMPANY_APPROVAL

---

## Rule 4

Approval approval changes Work Order state.

APPROVED → Work Order APPROVED

---

## Rule 5

Status history is immutable.

Every status transition creates a history record.

---

## Rule 6

QR history never exposes:

- Costs
- Customer data
- Suppliers
- Internal notes
- Invoices

---

## Rule 7

Mixed AI questions follow SQL-first architecture.

Example:

"How did we solve similar Citroen air filter failures?"

Flow:

1. Query workshop history
2. Query suppliers
3. Query costs
4. Generate contextual answer

---

## Rule 8

Vector Store is not operational memory.

Use Vector Store only for:

- Manuals
- Procedures
- Policies
- Technical documentation

Never for:

- Work Orders
- Customers
- Vehicles
- Suppliers
- Costs

---

# Monorepo Structure

apps/
  web/

packages/
  db/
  shared/
  ai/
  integrations/
  ui/

---

# Feature Structure

features/
  customers/
  companies/
  vehicles/
  work-orders/
  quotes/
  approvals/
  parts/
  suppliers/
  attachments/
  dashboard/
  public-history/
  ai-assistant/
  messaging/

Each feature contains:

- components
- services
- actions
- queries
- schemas
- types