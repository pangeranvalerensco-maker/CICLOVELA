# Aturan Implementasi AI CICLOVELA

Dokumen ini wajib bagi agen AI mana pun yang bekerja di CICLOVELA.

## Sumber Kebenaran (Source of Truth)

Sebelum mengimplementasikan apa pun, baca:

- /CLAUDE.md
- /docs/00-project-overview.md
- /docs/01-requirements.md
- /docs/02-business-rules.md
- /docs/03-system-architecture.md
- /docs/04-database/database-design.md
- /docs/04-database/database-schema.md

Jangan menciptakan aturan bisnis yang tidak terdokumentasi.

## Database

Database:

PostgreSQL

ORM:

Spring Data JPA / Hibernate

Primary key:

UUID

Application enum:

Java Enum

PostgreSQL Native ENUM tidak boleh diperkenalkan kecuali disetujui secara eksplisit.

## Inventaris (Inventory)

Inventaris harus dilacak berdasarkan batch.

Jangan pernah membuat field stok di level produk sebagai inventaris otoritatif.

Konsep yang benar:

Product
→ Batch
→ Inventory
→ Inventory Movement

Setiap operasi yang mengubah stok harus direpresentasikan oleh sebuah pergerakan inventaris (inventory movement).

## Limbah (Waste)

Limbah adalah fitur bisnis utama (first-class).

Limbah harus merujuk pada batch dan inventaris yang terdampak.

Jangan mengimplementasikan limbah hanya sebagai laporan.

## Entitas Bisnis (Business Entity)

Operasi distributor dan pengecer (retailer) memerlukan Business Entity yang telah disetujui.

Business Entity yang belum disetujui tidak boleh melakukan transaksi operasional.

## Peran (Roles)

Peran platform:

- PLATFORM_ADMIN
- FARMER
- CONSUMER

Distributor dan retailer adalah peran bisnis, bukan peran pengguna platform yang independen.

Mereka beroperasi melalui keanggotaan Business Entity.

## Alur Bisnis (Business Flow)

Farmer
→ Distributor
→ Retailer
→ Consumer

Sistem harus mempertahankan keterlacakan transaksi di seluruh alur ini.

## Aturan Pengembangan

Jangan:

- membuat entitas duplikat
- mengubah struktur database tanpa memperbarui dokumentasi
- mengabaikan aturan bisnis yang ada
- menghapus kendala (constraints) tanpa alasan yang jelas
- membuat fitur yang tidak perlu sebelum persyaratan MVP selesai
- mengimplementasikan pelacakan pengiriman real-time untuk MVP
- menjadikan integrasi payment gateway sebagai prasyarat untuk transaksi inti

Prioritaskan:

P0 → P1 → P2

P0 harus stabil sebelum mengimplementasikan P1.

P1 harus stabil sebelum mengimplementasikan P2.

## Prinsip Pengkodean

Pilihlah implementasi yang sederhana dan mudah dipelihara daripada kompleksitas yang tidak perlu.

Jangan memperkenalkan teknologi atau pola arsitektur kecuali hal tersebut memberikan manfaat yang jelas bagi CICLOVELA.