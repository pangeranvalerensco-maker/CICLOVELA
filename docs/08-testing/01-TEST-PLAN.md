# Rencana Pengujian

## Skenario Bisnis Kritis

### Skenario 1 — Farmer Membuat Batch

Farmer membuat Product → membuat Batch → kuantitas dan kedaluwarsa disimpan → inventory/pergerakan diinisialisasi sesuai dengan model yang telah diselesaikan.

### Skenario 2 — Distributor Menerima Batch

Distributor menerima kuantitas yang diizinkan → transaksi dicatat → inventory meningkat → pergerakan dicatat.

### Skenario 3 — Distributor Mentransfer ke Retailer

Distributor mentransfer kuantitas → kepemilikan/sumber/tujuan dicatat → stok distributor menurun → stok retailer meningkat.

### Skenario 4 — Retailer Menjual

Retailer membuat penjualan/pesanan → inventory menurun sesuai aturan pesanan yang telah diselesaikan → riwayat transaksi dipertahankan.

### Skenario 5 — Limbah (Waste)

Pengguna mencatat waste → batch dan kuantitas divalidasi → inventory menurun → catatan waste ada → keterlacakan mencerminkan peristiwa tersebut.

### Skenario 6 — Perbedaan Kedaluwarsa

Dua batch dari produk yang sama memiliki tanggal kedaluwarsa yang berbeda. UI/API harus mempertahankan perbedaan tersebut.

### Skenario 7 — Akses Tidak Diotorisasi

Konsumen (Consumer) mencoba operasi khusus distributor → 403.

### Skenario 8 — Persetujuan Entitas

Pengguna meminta Business Entity → Platform Admin menyetujui → entitas menjadi aktif → operasi keanggotaan yang diizinkan menjadi tersedia.

## Pengujian Teknis

- autentikasi (authentication);
- otorisasi (authorization);
- CRUD;
- validasi;
- paginasi;
- pencarian/penyaringan/pengurutan (search/filter/sorting);
- unggah file;
- penanganan kesalahan (error handling);
- hapus sementara (soft delete);
- konsistensi inventory;
- endpoint dokumentasi API.
