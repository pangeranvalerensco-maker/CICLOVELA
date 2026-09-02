# Dokumen Kebutuhan Produk

## Masalah

Barang pertanian dapat melewati beberapa pelaku sebelum mencapai konsumen. Tanpa catatan yang terstruktur, menjadi sulit untuk menentukan asal mula suatu batch, stok saat ini, perubahan kepemilikan, perubahan harga, risiko kedaluwarsa, dan limbah.

## Tujuan Produk

Membangun platform fullstack yang menyediakan manajemen terkontrol dan keterlacakan produk pertanian di seluruh rantai pasok.

## Perjalanan Pengguna Inti

### Farmer

Daftar → buat product/batch → tentukan kuantitas/kualitas/kedaluwarsa → tawarkan/transfer ke distributor → lihat riwayat batch.

### Distributor

Bergabung dengan Business Entity yang disetujui → terima/beli batch → inventory meningkat → catat transfer/penjualan ke pengecer → inventory menurun → catat waste jika berlaku.

### Retailer

Bergabung dengan Business Entity yang disetujui → terima batch → kelola inventory → jual ke konsumen → catat waste.

### Consumer

Daftar/login → telusuri produk yang tersedia → lihat informasi produk yang diizinkan → buat pesanan → lihat status pesanan → lihat keterlacakan yang diizinkan.

### Platform Admin

Login → tinjau permintaan Business Entity → setujui/tolak → kelola data tingkat platform → periksa aktivitas yang relevan untuk audit.

## Kebutuhan Fungsional

### Autentikasi

- Register
- Login
- Logout
- Lupa kata sandi
- Atur ulang kata sandi
- Autentikasi berbasis JWT
- Rute yang dilindungi
- Otorisasi berbasis peran

### Entitas Bisnis (Business Entity)

- Buat permintaan
- Persetujuan/penolakan oleh Admin
- Profil entitas
- Keanggotaan entitas
- Penugasan peran anggota
- Status entitas

### Produk (Product)

- Buat (Create)
- Baca/daftar/detail (Read/list/detail)
- Perbarui (Update)
- Hapus sementara (Soft delete)
- Pencarian (Search)
- Filter
- Urutkan (Sort)
- Paginasi (Pagination)
- Unggahan opsional gambar/dokumen produk

### Batch

- Buat (Create)
- Baca/daftar/detail (Read/list/detail)
- Perbarui (Update)
- Hapus sementara jika sesuai (Soft delete)
- Kuantitas
- Tanggal panen/produksi
- Tanggal kedaluwarsa
- Nilai kualitas
- Pemilik saat ini
- Lokasi saat ini jika diperlukan

### Inventaris (Inventory)

- Lihat stok saat ini
- Lihat stok berdasarkan produk
- Lihat stok berdasarkan batch
- Lihat stok berdasarkan pemilik/entitas
- Riwayat pergerakan inventaris
- Cegah stok negatif yang tidak mungkin terjadi

### Rantai Pasok (Supply Chain)

- Terima/beli batch
- Transfer batch/kuantitas antar pelaku
- Catat sumber dan tujuan
- Catat harga transaksi
- Pertahankan riwayat transaksi

### Pesanan / Penjualan (Order / Sale)

- Buat pesanan
- Item pesanan
- Status pesanan
- Reservasi/pengurangan inventaris sesuai aturan bisnis yang diselesaikan
- Riwayat pesanan konsumen

### Limbah (Waste)

- Catat waste
- Catat batch
- Catat kuantitas
- Catat alasan
- Catat stempel waktu (timestamp)
- Hitung tingkat waste
- Sertakan waste dalam pergerakan/riwayat inventaris

### Keterlacakan (Traceability)

- Riwayat batch
- Asal mula
- Perubahan kepemilikan
- Peristiwa rantai pasok
- Perubahan kuantitas
- Peristiwa waste
- Batas informasi publik/aman bagi konsumen

## Kebutuhan Non-Fungsional

- UI responsif
- Respons API konsisten
- Validasi di klien dan server
- Autentikasi aman
- Otorisasi berbasis peran
- Paginasi/pencarian/filter/pengurutan
- Dokumentasi API
- Penanganan kesalahan (Error handling)
- Soft delete
- Seed data
- Monorepo publik di GitHub
