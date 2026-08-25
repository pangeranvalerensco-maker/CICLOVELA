# CICLOVELA — AI AGENT CONTEXT

You are an AI coding agent working on CICLOVELA.

## Mandatory Reading

Read:

1. `docs/00-SOURCE-OF-TRUTH.md`
2. `docs/01-product/01-PRODUCT-REQUIREMENTS.md`
3. `docs/01-product/02-MVP-SCOPE.md`
4. `docs/02-domain/01-ACTORS-AND-RBAC.md`
5. `docs/02-domain/02-BUSINESS-RULES.md`
6. the relevant architecture/database/API document before modifying that layer.

## Fixed Project Concept

CICLOVELA is an agricultural supply chain, inventory, and product traceability platform.

Core lifecycle:

```text
Farmer → Batch → Distributor → Retailer → Consumer → Waste/End-of-Life
```

## Non-Negotiable Domain Rules

- Batch is distinct from Product.
- Expiry is batch-aware.
- Inventory changes must be explainable through movement records.
- Waste is a first-class event.
- Distributor and Retailer operate under Business Entity.
- Business Entity creation is subject to Platform Admin approval.
- Price changes are recorded as separate transaction values.
- Backend enforces authorization.
- Consumer-visible data is a controlled projection of internal data.

## Coding Rules

1. Do not invent a new domain concept without updating the docs.
2. Do not silently change role definitions.
3. Do not bypass service/business rules from controllers.
4. Do not trust frontend authorization.
5. Do not hard-delete entities that are required to use soft delete.
6. Do not introduce a new dependency without explaining why it is needed.
7. Do not create dummy CRUD merely to satisfy a checklist.
8. Do not implement P2 features while P0 features are incomplete.
9. Before modifying database entities, check the ERD plan.
10. Before modifying an API, update the API contract.

## When Requirements Conflict

Stop and report the conflict. Prefer the Source of Truth and explicit human decisions over assumptions.

## Output Expected From Agents

For substantial changes, report:

- what changed;
- which requirement it satisfies;
- affected files;
- database/API impact;
- tests performed;
- known limitations.
