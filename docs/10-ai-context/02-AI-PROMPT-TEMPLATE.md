# AI Task Prompt Template

Use this template when delegating work to an AI coding agent.

```text
You are working on CICLOVELA.

First read:
- docs/00-SOURCE-OF-TRUTH.md
- docs/01-product/01-PRODUCT-REQUIREMENTS.md
- docs/01-product/02-MVP-SCOPE.md
- docs/02-domain/01-ACTORS-AND-RBAC.md
- docs/02-domain/02-BUSINESS-RULES.md

Task:
[DESCRIBE ONE COHERENT TASK]

Constraints:
- Do not change the fixed domain model unless explicitly instructed.
- Do not invent roles.
- Do not bypass backend authorization.
- Keep API contracts consistent.
- Keep database normalization in mind.
- Add validation and error handling.
- Add/update tests where relevant.

Before coding:
1. Explain the implementation plan briefly.
2. Identify affected entities/endpoints/files.
3. Identify any requirement conflict.

After coding:
1. Summarize changes.
2. List files changed.
3. Explain business rules implemented.
4. Report tests/build status.
5. Report unresolved issues.
```
