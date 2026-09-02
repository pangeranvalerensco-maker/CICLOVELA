# Templat Prompt Tugas AI

Gunakan templat ini saat mendelegasikan pekerjaan ke agen pengkodean AI.

```text
Anda sedang mengerjakan CICLOVELA.

Baca terlebih dahulu:
- docs/00-SOURCE-OF-TRUTH.md
- docs/01-product/01-PRODUCT-REQUIREMENTS.md
- docs/01-product/02-MVP-SCOPE.md
- docs/02-domain/01-ACTORS-AND-RBAC.md
- docs/02-domain/02-BUSINESS-RULES.md

Tugas:
[DESKRIPSIKAN SATU TUGAS YANG KOHEREN]

Batasan:
- Jangan mengubah model domain tetap kecuali diinstruksikan secara eksplisit.
- Jangan menciptakan peran baru.
- Jangan mengabaikan otorisasi backend.
- Jaga agar kontrak API tetap konsisten.
- Perhatikan normalisasi database.
- Tambahkan validasi dan penanganan kesalahan.
- Tambahkan/perbarui pengujian jika relevan.

Sebelum mengode:
1. Jelaskan rencana implementasi secara singkat.
2. Identifikasi entitas/endpoint/file yang terdampak.
3. Identifikasi jika ada konflik persyaratan.

Setelah mengode:
1. Ringkas perubahan yang dilakukan.
2. Cantumkan file yang diubah.
3. Jelaskan aturan bisnis yang diimplementasikan.
4. Laporkan status pengujian/build.
5. Laporkan masalah yang belum terselesaikan.
```
