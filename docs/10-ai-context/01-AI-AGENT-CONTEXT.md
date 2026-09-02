# CICLOVELA — KONTEKS AGEN AI (AI AGENT CONTEXT)

Anda adalah agen pengkodean AI yang bekerja di CICLOVELA.

## Bacaan Wajib

Baca:

1. `docs/00-SOURCE-OF-TRUTH.md`
2. `docs/01-product/01-PRODUCT-REQUIREMENTS.md`
3. `docs/01-product/02-MVP-SCOPE.md`
4. `docs/02-domain/01-ACTORS-AND-RBAC.md`
5. `docs/02-domain/02-BUSINESS-RULES.md`
6. dokumen arsitektur/database/API yang relevan sebelum memodifikasi lapisan tersebut.

## Konsep Proyek Tetap

CICLOVELA adalah platform rantai pasok pertanian, inventaris, dan keterlacakan produk.

Siklus hidup inti:

```text
Farmer → Batch → Distributor → Retailer → Consumer → Waste/End-of-Life
```

## Aturan Domain yang Tidak Dapat Ditawar

- Batch berbeda dengan Product.
- Kedaluwarsa (Expiry) disesuaikan dengan batch.
- Perubahan inventory harus dapat dijelaskan melalui catatan pergerakan.
- Limbah (Waste) adalah peristiwa bisnis kelas satu.
- Distributor dan Retailer beroperasi di bawah Business Entity.
- Pembuatan Business Entity tunduk pada persetujuan Platform Admin.
- Perubahan harga dicatat sebagai nilai transaksi yang terpisah.
- Backend menegakkan otorisasi.
- Data yang terlihat oleh konsumen adalah proyeksi terkontrol dari data internal.

## Aturan Pengkodean

1. Jangan menciptakan konsep domain baru tanpa memperbarui dokumen.
2. Jangan diam-diam mengubah definisi peran.
3. Jangan mengabaikan layanan/aturan bisnis dari controller.
4. Jangan mempercayai otorisasi frontend.
5. Jangan melakukan penghapusan permanen (hard-delete) pada entitas yang diwajibkan menggunakan soft delete.
6. Jangan memperkenalkan dependensi baru tanpa menjelaskan mengapa itu diperlukan.
7. Jangan membuat CRUD palsu hanya sekadar untuk memenuhi daftar periksa (checklist).
8. Jangan mengimplementasikan fitur P2 sementara fitur P0 belum selesai.
9. Sebelum mengubah entitas database, periksa rencana ERD.
10. Sebelum mengubah API, perbarui kontrak API.

## Ketika Persyaratan Bertentangan

Berhenti dan laporkan konflik tersebut. Lebih utamakan dokumen Sumber Kebenaran (Source of Truth) dan keputusan eksplisit manusia daripada sekadar asumsi.

## Output yang Diharapkan Dari Agen

Untuk perubahan substansial, laporkan:

- apa yang berubah;
- persyaratan mana yang dipenuhi;
- file yang terdampak;
- dampak database/API;
- pengujian yang dilakukan;
- batasan yang diketahui.
