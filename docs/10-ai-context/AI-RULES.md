# CICLOVELA AI DEVELOPMENT RULES

## RULE 1 - READ BEFORE CODE

Before coding, read:

1. docs/ai/AI-CONTEXT.md
2. docs/00-project-overview.md
3. docs/01-project-scope.md
4. Relevant domain documentation
5. Relevant database documentation

Never start implementation based only on the current chat message.

---

## RULE 2 - SOURCE OF TRUTH

The documentation inside /docs is the project's source of truth.

Code must follow the documentation.

If code and documentation conflict:

DO NOT silently change either one.

Report the conflict first.

---

## RULE 3 - NO INVENTED REQUIREMENTS

The AI must not invent:

- entities
- roles
- business processes
- permissions
- database fields
- API endpoints
- integrations

unless they are required by existing documentation
or explicitly approved by the project owner.

---

## RULE 4 - MINIMAL IMPLEMENTATION

Prefer the simplest implementation that satisfies
the documented requirement.

Do not over-engineer.

Do not introduce unnecessary:
- design patterns
- frameworks
- libraries
- microservices
- abstractions

---

## RULE 5 - DATABASE

Database:

PostgreSQL

Database client:

DBeaver

Backend:

Spring Boot

ORM:

Spring Data JPA / Hibernate

Hibernate must validate the existing schema.

Do not use:

spring.jpa.hibernate.ddl-auto=create

Recommended:

spring.jpa.hibernate.ddl-auto=validate

## RULE 6 - INVENTORY

Inventory is a critical domain.

Never directly modify inventory quantity without
creating the corresponding inventory movement.

Inventory movements are historical records.

Inventory movement records are immutable.

All inventory-changing operations must be transactional.

Inventory must prevent negative stock.
