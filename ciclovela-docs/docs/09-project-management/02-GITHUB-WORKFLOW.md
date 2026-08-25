# GitHub Workflow

## Repository

The project must use one public GitHub repository containing frontend and backend because the project rules explicitly require a public monorepo.

## Branches

Recommended:

```text
main       = stable/demo
 develop   = integration
 feature/* = individual work
```

For a solo project, keep the workflow lightweight. Do not create branch bureaucracy for the sake of looking like a company of 400 people.

## Commit Convention

Use human-readable commits:

```text
feat: add batch management
fix: prevent negative inventory
refactor: simplify inventory service
docs: update business rules
chore: configure swagger
```

## AI Contribution Policy

AI agents are tools, not project authors. The human developer remains responsible for architecture, requirements, review, testing, and final commits.

AI-generated code must be reviewed before merge.

Do not create fake commits, fake authorship, or misleading contribution history. The goal is a genuine engineering project, not an archaeological reconstruction of who typed every semicolon.

## Daily Push Rule

At least one meaningful push per work session/day.

Each push should represent a coherent state, preferably:

1. requirement/domain change;
2. backend implementation;
3. frontend implementation;
4. tests/fixes;
5. documentation.
