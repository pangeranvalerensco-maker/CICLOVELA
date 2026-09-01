# CICLOVELA AI Implementation Rules

This document is mandatory for any AI agent working on CICLOVELA.

## Source of Truth

Before implementing anything, read:

- /CLAUDE.md
- /docs/00-project-overview.md
- /docs/01-requirements.md
- /docs/02-business-rules.md
- /docs/03-system-architecture.md
- /docs/04-database/database-design.md
- /docs/04-database/database-schema.md

Do not invent business rules that are not documented.

## Database

Database:

PostgreSQL

ORM:

Spring Data JPA / Hibernate

Primary key:

UUID

Application enum:

Java Enum

PostgreSQL Native ENUM must not be introduced unless explicitly approved.

## Inventory

Inventory must be tracked by batch.

Never create a product-level stock field as the authoritative inventory.

Correct concept:

Product
→ Batch
→ Inventory
→ Inventory Movement

Any stock-changing operation must be represented by an inventory movement.

## Waste

Waste is a first-class business feature.

Waste must reference the affected batch and inventory.

Do not implement waste only as a report.

## Business Entity

Distributor and retailer operations require an approved Business Entity.

An unapproved Business Entity must not perform operational transactions.

## Roles

Platform roles:

- PLATFORM_ADMIN
- FARMER
- CONSUMER

Distributor and retailer are business roles, not independent platform user roles.

They operate through Business Entity membership.

## Business Flow

Farmer
→ Distributor
→ Retailer
→ Consumer

The system must preserve transaction traceability across this flow.

## Development Rules

Do not:

- create duplicate entities
- change database structure without updating documentation
- bypass existing business rules
- remove constraints without justification
- create unnecessary features before MVP requirements are complete
- implement real-time delivery tracking for MVP
- make payment gateway integration a prerequisite for core transactions

Prioritize:

P0 → P1 → P2

P0 must be stable before implementing P1.

P1 must be stable before implementing P2.

## Coding Principle

Prefer simple, maintainable implementation over unnecessary complexity.

Do not introduce technologies or architectural patterns unless they provide a clear benefit to CICLOVELA.