# CICLOVELA

Agricultural Supply Chain, Inventory & Product Traceability Platform.

## Project Identity

**Name:** CICLOVELA  
**Core concept:** product lifecycle, supply-chain movement, inventory, value, traceability, and waste.

Ciclovela is not intended to be a pure accounting system, marketplace, real-time delivery tracker, or organization-management system. Its core is the controlled recording of how agricultural goods move through the supply chain and how their quantity, ownership, condition, value, and waste change along that lifecycle.

## Repository Structure

```text
ciclovela/
├── backend/
├── frontend/
├── docs/
├── database/
└── README.md
```

## Source of Truth

Before implementation, read `docs/00-SOURCE-OF-TRUTH.md`. Every AI coding agent and collaborator must treat the documents in `docs/` as the project contract. If code conflicts with the docs, stop and resolve the discrepancy before continuing.

## Recommended Stack

- Frontend: React + TypeScript
- Backend: Spring Boot + Java
- Database: PostgreSQL
- Authentication: JWT
- API documentation: OpenAPI / Swagger
- Version control: Git + GitHub monorepo

The stack is intentionally conventional so the three-week schedule is spent on domain quality rather than discovering a new framework because humanity apparently enjoys unnecessary suffering.

## Status

- Project concept: **FIXED**
- Project name: **FIXED**
- Core domain: **FIXED**
- Scope priorities: **FIXED**
- Detailed ERD/API contracts: to be finalized before coding
- Implementation: not started

## Deadline

The provided project rules state the submission deadline is **Friday, 18 September 2026 at 22:00 WIB**.

The project plan therefore targets a 21-day implementation cycle plus a buffer for integration, testing, deployment, and submission preparation.


Biasanya **konteks percakapan ini tetap tersimpan di GitHub Copilot Chat**, sehingga setelah VS Code dibuka kembali Anda dapat melanjutkan dari chat yang sama.

Namun, jangan mengandalkan saya untuk mengingat semua detail jika:

- Membuka chat baru
- Menghapus riwayat percakapan
- Workspace berubah
- Sesi atau extension mengalami reset

Agar aman, keputusan penting proyek sudah tersimpan di file dokumentasi. Saat ini keputusan terakhir kita adalah menggunakan **arsitektur microservices** dengan service:

```text
api-gateway
auth-service
catalog-service
inventory-service
order-service
traceability-service
```

Ketika melanjutkan, cukup buka percakapan ini dan katakan, misalnya: **“lanjutkan pembangunan auth-service”**.