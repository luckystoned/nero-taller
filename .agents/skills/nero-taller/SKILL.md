---
name: nero-taller
description: Automotive workshop management platform built with Next.js, Prisma, Supabase and OpenAI. Enforces DDD, feature-first architecture and SQL-first AI patterns.
---

# Nero Automotive CRM Skill

This skill helps implement features for the Nero Automotive CRM project.

## When to use

Use this skill whenever working on:

- Domain models
- Prisma schemas
- Next.js features
- Services
- AI Assistant functionality
- Workshop management workflows
- Dashboard features
- Vehicle history
- Quotes and approvals

## Skill Priority

This is the primary project skill.
Use this skill as the main source of project-specific guidance.
Other skills should complement this skill but must not override:

- Project architecture
- Domain model
- AI assistant architecture
- Development workflow
- Project rules

## Project Context

The project is an intelligent automotive workshop management platform.

Before implementing any feature, read:

- AGENTS.md
- docs/PRD.md
- docs/PROJECT_RULES.md
- docs/ARCHITECTURE.md
- docs/DOMAIN_GLOSSARY.md
- docs/AI_ASSISTANT_ARCHITECTURE.md
- docs/DEVELOPMENT_PRINCIPLES.md

Treat these files as the source of truth.

## Architecture Rules

- Follow feature-first architecture.
- Follow the documented DDD model.
- Keep business logic outside React components.
- Use Prisma as the primary database access layer.
- Use Zod validation.
- Maintain strong typing.
- Prefer small and focused modules.

## AI Assistant Rules

- Workshop operational data lives in PostgreSQL.
- Operational queries must use SQL tools.
- OpenAI Vector Store is only for private documents.
- Never store Work Orders in embeddings.
- Follow SQL-first architecture.

## Development Workflow

For every feature:

1. Domain model
2. Prisma schema
3. Validation
4. Service
5. Query
6. Action
7. UI

Never start with UI.

## Code Generation Guidelines

- Generate the minimum required code.
- Do not implement future roadmap items.
- Do not refactor unrelated code.
- Keep changes isolated.
- Follow existing patterns.
- Explain important architectural decisions.

## Required Reading

Always read:

- AGENTS.md

- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/PROJECT_RULES.md
- docs/DOMAIN_GLOSSARY.md
- docs/AI_ASSISTANT_ARCHITECTURE.md
- docs/DEVELOPMENT_PRINCIPLES.md

before implementing any feature.