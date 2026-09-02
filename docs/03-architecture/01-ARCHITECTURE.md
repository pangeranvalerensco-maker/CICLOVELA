# Arsitektur Sistem

## Arsitektur Target

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

## Aturan Arsitektur

Aturan bisnis tidak boleh hanya ada di frontend. Backend adalah penanggung jawab otoritatif atas izin, validasi, mutasi inventory, perubahan kepemilikan, dan integritas transaksi.

## Integritas Transaksi

Operasi yang mengubah inventory dan membuat peristiwa bisnis yang sesuai harus dijalankan secara transaksional di mana semestinya.

Contoh:

```text
Receive batch
→ create transaction
→ increase inventory
→ create inventory movement
→ commit
```

Jika langkah yang diperlukan gagal, operasi tidak boleh meninggalkan inventory dalam kondisi tidak konsisten.
