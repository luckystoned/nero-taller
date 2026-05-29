# Nero Automotive CRM

## Project Overview

Nero Automotive CRM is an intelligent workshop management platform for automotive repair shops.

Before making any code changes, always read:

- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/PROJECT_RULES.md
- docs/DOMAIN_GLOSSARY.md
- docs/AI_ASSISTANT_ARCHITECTURE.md
- docs/DEVELOPMENT_PRINCIPLES.md

These documents are the source of truth for the project.

If there is any conflict between code and documentation, follow the documentation.

---

## Technology Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Tailwind CSS
- shadcn/ui
- Zod
- React Hook Form
- OpenAI API

---

## Architecture Rules

- Follow a feature-first architecture.
- Keep business logic outside React components.
- Use Prisma as the primary data access layer.
- Validate all inputs with Zod.
- Maintain clear separation between UI, Services, and Data Access.
- Keep the codebase strongly typed.
- Prefer composition over inheritance.
- Keep modules loosely coupled.

---

## Development Rules

- Implement only the requested scope.
- Do not build future roadmap features.
- Do not modify unrelated domains.
- Do not introduce dependencies without justification.
- Keep the MVP simple.
- Avoid premature optimization.
- Avoid unnecessary abstractions.

---

## AI Assistant Rules

- Operational workshop history lives in PostgreSQL.
- Operational queries must use SQL-based tools.
- OpenAI Vector Store is reserved for private documents only.
- Do not use embeddings for Work Orders in the MVP.
- Follow a SQL-first architecture.
- Do not use File Search as the primary source of workshop data.

---

## Preferred Skills

When working on this repository, always use the following skill first:

- nero-taller

Additional skills may be used when relevant:

- nextjs-app-router-patterns
- prisma-client-api
- prisma-database-setup
- supabase
- shadcn
- tailwind
- react-expert
- zod

---

## Preferred Development Workflow

For each feature, follow this order:

1. Domain Model
2. Validation
3. Service Layer
4. Query Layer
5. Action Layer
6. UI Layer

Never start from the UI.

---

## Code Generation Guidelines

When implementing a feature:

- Read all project documentation first.
- Respect the existing architecture.
- Generate the minimum amount of code required.
- Keep changes focused and isolated.
- Do not refactor unrelated code.
- Explain major architectural decisions when introducing them.
- Prefer maintainability over cleverness.

---

## Success Criteria

Every implementation should:

- Compile successfully.
- Follow the documented architecture.
- Respect domain boundaries.
- Maintain strong typing.
- Be ready for incremental iteration.

---

## Documentation Priority

When documentation conflicts exist, use the following priority:

1. AGENTS.md
2. docs/PROJECT_RULES.md
3. docs/ARCHITECTURE.md
4. docs/PRD.md
5. Feature-specific implementation details

Never introduce architectural decisions that contradict the documentation.