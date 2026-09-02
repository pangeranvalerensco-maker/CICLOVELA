# ATURAN PENGEMBANGAN AI CICLOVELA

## ATURAN 1 - BACA SEBELUM MENGODE

Sebelum menulis kode, baca:

1. docs/ai/AI-CONTEXT.md
2. docs/00-project-overview.md
3. docs/01-project-scope.md
4. Dokumentasi domain yang relevan
5. Dokumentasi database yang relevan

Jangan pernah memulai implementasi hanya berdasarkan pesan obrolan (chat) saat ini.

---

## ATURAN 2 - SUMBER KEBENARAN (SOURCE OF TRUTH)

Dokumentasi di dalam /docs adalah sumber kebenaran proyek.

Kode harus mengikuti dokumentasi.

Jika kode dan dokumentasi saling bertentangan:

JANGAN diam-diam mengubah salah satunya.

Laporkan konflik tersebut terlebih dahulu.

---

## ATURAN 3 - TIDAK MENCIPTAKAN PERSYARATAN SENDIRI

AI tidak boleh menciptakan:

- entitas
- peran (roles)
- proses bisnis
- perizinan (permissions)
- field database
- endpoint API
- integrasi

kecuali hal-hal tersebut diwajibkan oleh dokumentasi yang ada
atau disetujui secara eksplisit oleh pemilik proyek.

---

## ATURAN 4 - IMPLEMENTASI MINIMAL

Pilihlah implementasi paling sederhana yang memenuhi
persyaratan yang didokumentasikan.

Jangan melakukan rekayasa berlebihan (over-engineer).

Jangan memperkenalkan hal-hal yang tidak perlu seperti:
- pola desain (design patterns)
- kerangka kerja (frameworks)
- pustaka (libraries)
- layanan mikro (microservices)
- abstraksi

---

## ATURAN 5 - DATABASE

Database:

PostgreSQL

Klien database:

DBeaver

Backend:

Spring Boot

ORM:

Spring Data JPA / Hibernate

Hibernate harus memvalidasi skema yang sudah ada.

Jangan gunakan:

spring.jpa.hibernate.ddl-auto=create

Direkomendasikan:

spring.jpa.hibernate.ddl-auto=validate

## ATURAN 6 - INVENTARIS

Inventaris adalah domain yang sangat penting.

Jangan pernah memodifikasi kuantitas inventaris secara langsung tanpa
membuat pergerakan inventaris (inventory movement) yang sesuai.

Pergerakan inventaris adalah catatan historis.

Catatan pergerakan inventaris bersifat kekal (immutable).

Semua operasi yang mengubah inventaris harus bersifat transaksional.

Inventaris harus mencegah stok negatif.
