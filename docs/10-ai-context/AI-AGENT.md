# CICLOVELA - INSTRUKSI PROYEK AGEN AI

## LANGKAH PERTAMA

Sebelum melakukan tugas pengembangan apa pun, baca:

- docs/ai/AI-CONTEXT.md
- docs/ai/AI-RULES.md

Kemudian baca dokumentasi domain yang relevan.

---

## SUMBER KEBENARAN PROYEK (PROJECT SOURCE OF TRUTH)

Direktori `/docs` adalah sumber otoritatif
untuk persyaratan dan arsitektur proyek.

Jangan menciptakan persyaratan sendiri.

Jangan diam-diam mengubah persyaratan.

Jika persyaratan ambigu atau saling bertentangan,
laporkan masalah tersebut sebelum menulis kode.

---

## PROYEK

CICLOVELA adalah sistem rantai pasok agribisnis,
inventaris, keterlacakan batch, dan manajemen limbah (waste management).

Rantai pasok inti:

Farmer
→ Distributor
→ Retailer
→ Consumer

---

## TEKNOLOGI

Backend:
Spring Boot

Database:
PostgreSQL

Klien database:
DBeaver

ORM:
Spring Data JPA / Hibernate

---

## PRINSIP PENGEMBANGAN

Bangun secara bertahap.

Prioritaskan persyaratan P0 terlebih dahulu.

Jangan mengimplementasikan fitur P1/P2
kecuali diminta secara eksplisit.

Pertahankan implementasi agar tetap sederhana,
mudah dipelihara, dan konsisten dengan dokumentasi.

---

## SEBELUM SETIAP PERUBAHAN BESAR

Periksa dokumentasi yang relevan.

Jika perubahan yang diminta memengaruhi:
- database
- entitas
- aturan bisnis
- peran (roles)
- autentikasi
- inventaris
- transaksi

tinjau dokumentasi yang relevan terlebih dahulu.

Setelah implementasi, perbarui dokumentasi
jika arsitektur atau persyaratan yang disetujui berubah.