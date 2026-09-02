# Kebutuhan Database

## Aturan Wajib Dari Spesifikasi Proyek

- Minimal 6 tabel utama.
- Minimal 5 relasi.
- Primary Key dan Foreign Key.
- Minimal normalisasi hingga 3NF.
- `created_at` dan `updated_at` pada setiap tabel utama.
- Soft delete pada setidaknya 2 tabel.
- Minimal 20 data awal (seed records) untuk setiap tabel utama.
- Jenis relasi yang diwajibkan: One-to-One, One-to-Many, Many-to-One, Many-to-Many.

## Rekomendasi Tabel Inti

Desain akhir diharapkan memiliki lebih dari jumlah minimum karena domain memerlukan pemisahan tanggung jawab (separation of concerns).

Tabel kandidat:

1. users
2. farmer_profiles
3. business_entities
4. memberships
5. products
6. product_categories
7. batches
8. inventories
9. inventory_movements
10. supply_transactions
11. orders
12. order_items
13. waste_records
14. attachments
15. password_reset_tokens / dukungan autentikasi setara

Daftar tabel yang tepat akan difinalisasi selama perancangan ERD.

## Kandidat Soft Delete

Rekomendasi:

- products
- business_entities

Kandidat tambahan dapat digunakan jika diperlukan.

## Strategi Seed Data

Seed data harus cukup realistis untuk mendemonstrasikan:

- beberapa farmer;
- beberapa entitas;
- distributor dan retailer;
- beberapa produk;
- beberapa batch dengan tanggal kedaluwarsa yang berbeda;
- pergerakan inventory masuk/keluar (inbound/outbound);
- harga transaksi yang berbeda-beda;
- peristiwa waste;
- pesanan konsumen.

Jangan membuat 20 baris tanpa makna sekadar untuk memenuhi kotak centang (checkbox). Kumpulan data awal harus dapat menceritakan alur cerita yang koheren saat demonstrasi.
