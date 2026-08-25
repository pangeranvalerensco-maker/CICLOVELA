# System Architecture

## Target Architecture

```text
React + TypeScript
        │
        │ HTTPS / JSON REST
        ▼
Spring Boot REST API
        │
        ├── Authentication / Authorization
        ├── Domain Services
        ├── Validation
        ├── Inventory Logic
        ├── Supply Chain Logic
        ├── Waste Logic
        └── Traceability Queries
        │
        ▼
PostgreSQL
```

## Monorepo

```text
ciclovela/
├── backend/
├── frontend/
├── database/
├── docs/
└── README.md
```

## Architectural Rule

Business rules must not live only in the frontend. The backend is authoritative for permissions, validation, inventory mutations, ownership changes, and transaction integrity.

## Transaction Integrity

Operations that change inventory and create a corresponding business event should execute transactionally where appropriate.

Example:

```text
Receive batch
→ create transaction
→ increase inventory
→ create inventory movement
→ commit
```

If a required step fails, the operation must not leave inconsistent inventory.
