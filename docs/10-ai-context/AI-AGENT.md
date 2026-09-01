# CICLOVELA - AI AGENT PROJECT INSTRUCTIONS

## FIRST STEP

Before performing any development task, read:

- docs/ai/AI-CONTEXT.md
- docs/ai/AI-RULES.md

Then read the relevant domain documentation.

---

## PROJECT SOURCE OF TRUTH

The `/docs` directory is the authoritative source
for project requirements and architecture.

Do not invent requirements.

Do not silently change requirements.

If requirements are ambiguous or contradictory,
report the issue before coding.

---

## PROJECT

CICLOVELA is an agribusiness supply-chain,
inventory, batch traceability and waste management system.

Core supply chain:

Farmer
→ Distributor
→ Retailer
→ Consumer

---

## TECHNOLOGY

Backend:
Spring Boot

Database:
PostgreSQL

Database client:
DBeaver

ORM:
Spring Data JPA / Hibernate

---

## DEVELOPMENT PRINCIPLE

Build in phases.

Prioritize P0 requirements first.

Do not implement P1/P2 features
unless explicitly requested.

Keep implementation simple,
maintainable and consistent with documentation.

---

## BEFORE EVERY MAJOR CHANGE

Check relevant documentation.

If the requested change affects:
- database
- entity
- business rules
- roles
- authentication
- inventory
- transactions

review the relevant documentation first.

After implementation, update documentation
when the architecture or approved requirement changes.