# Project Rules

## Tech Stack

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

- Use a feature-first architecture.
- Keep business logic outside React components.
- Use Services for business logic.
- Use Prisma as the primary database access layer.
- Avoid raw SQL unless strictly necessary.
- Use Zod validation for all inputs.
- Keep modules loosely coupled.
- Favor composition over inheritance.

---

## Code Quality

- Strong typing is mandatory.
- Avoid `any`.
- Prefer explicit interfaces and types.
- Keep files small and focused.
- Follow SOLID principles where practical.

---

## Restrictions

- Do not create features outside the requested scope.
- Do not introduce new infrastructure without justification.
- Do not modify domain models unless requested.
- Do not create premature abstractions.
- Do not implement future roadmap items.