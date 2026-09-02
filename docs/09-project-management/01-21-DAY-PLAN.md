# Rencana Implementasi 21 Hari

Tenggat waktu resmi proyek berdasarkan spesifikasi yang diberikan adalah Jumat, 18 September 2026 pukul 22:00 WIB. Jadwal di bawah ini sengaja dibuat agar pengerjaan fitur fungsional selesai sebelum tenggat waktu, sehingga hari-hari terakhir tidak dihabiskan untuk berdoa menghadapi merge conflict Git.

## Hari 1 — Penetapan Persyaratan (Freeze Requirements)

- Membaca seluruh dokumen.
- Menetapkan stack teknologi.
- Menetapkan peran (roles).
- Menetapkan cakupan P0.
- Menetapkan kosakata domain.
- Membuat repositori GitHub dan monorepo.

## Hari 2 — ERD & Database

- Finalisasi ERD.
- Constraints.
- Indeks.
- Field timestamp.
- Soft delete.
- Strategi seed data.

## Hari 3 — Kerangka Backend (Backend Skeleton)

- Spring Boot.
- Koneksi PostgreSQL.
- Struktur proyek.
- Penanganan respons/kesalahan global.
- OpenAPI.

## Hari 4 — Autentikasi

- Register.
- Login.
- JWT.
- Logout.
- Alur lupa/atur ulang kata sandi (Forgot/reset password).

## Hari 5 — RBAC & Business Entity

- Roles.
- Keanggotaan (Membership).
- Permintaan pembuatan entitas.
- Persetujuan Admin.

## Hari 6 — Product & Category

- CRUD.
- Validasi.
- Search/filter/sort/pagination.
- Dukungan unggah file.

## Hari 7 — Batch

- Batch CRUD.
- Kedaluwarsa (Expiry).
- Kualitas (Quality).
- Kuantitas (Quantity).
- Kepemilikan (Ownership).

## Hari 8 — Inti Inventaris (Inventory Core)

- Model inventory.
- Inventory movement.
- Aturan masuk/keluar (Inbound/outbound rules).
- Pengujian konsistensi.

## Hari 9 — Transaksi Pasokan (Supply Transactions)

- Receive/purchase.
- Transfer.
- Pencatatan harga.
- Perubahan kepemilikan.

## Hari 10 — Pesanan/Penjualan (Orders/Sales)

- Order.
- Order items.
- Efek pada inventory.
- Perizinan (Permissions).

## Hari 11 — Limbah (Waste)

- Waste records.
- Alasan waste (Reasons).
- Efek pada inventory.
- Tingkat waste (Waste rate).

## Hari 12 — Keterlacakan (Traceability)

- Riwayat batch.
- Timeline rantai pasok.
- Proyeksi aman untuk publik/internal.

## Hari 13 — Fondasi Frontend

- Aplikasi React.
- Routing.
- State autentikasi.
- API client.
- Tata letak (Layout).
- Fondasi responsif.

## Hari 14 — UI Autentikasi & Peran

- Login/register.
- Lupa/atur ulang (Forgot/reset).
- Rute privat.
- Rute peran.
- Halaman kesalahan (Error pages).

## Hari 15 — UI Product/Batch

- List/detail/create/edit/delete.
- Search/filter/sort.
- Pagination.
- Validasi.

## Hari 16 — UI Inventory/Supply

- Inventory.
- Riwayat pergerakan (Movement history).
- Terima (Receive).
- Transfer.

## Hari 17 — UI Orders/Waste/Traceability

- Orders.
- Waste.
- Traceability.
- Notifikasi.

## Hari 18 — Dasbor & P1

- Metrik nyata dari backend.
- Aktivitas terkini.
- Indikator kedaluwarsa/waste.
- Riwayat harga jika sudah stabil.

## Hari 19 — Integrasi & Seed Data

- Lebih dari 20 baris data seed koheren per tabel utama.
- Alur end-to-end.
- Perbaikan masalah integritas data.

## Hari 20 — Pengujian & Deployment

- Pengujian menyeluruh.
- Pengecekan keamanan.
- Swagger.
- Deployment.
- README.
- Diagram alir (Flowcharts).

## Hari 21 — Pembekuan Submission (Submission Freeze)

- Tidak ada fitur utama baru.
- Hanya perbaikan bug kritis.
- Verifikasi akses publik GitHub.
- Verifikasi deployment frontend/backend.
- Verifikasi README.
- Verifikasi akun demo.
- Verifikasi dokumentasi.
- Gladi bersih presentasi/demo akhir.

## Setelah Hari 21 / Waktu Cadangan (Buffer)

Gunakan waktu tersisa hanya untuk perbaikan bug kritis, masalah deployment, dan perbaikan opsional P1/P2 yang tidak merusak stabilitas inti.
