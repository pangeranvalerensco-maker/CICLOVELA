# Cakupan MVP & Prioritas

## P0 — Harus Ada

1. Alur autentikasi yang diwajibkan oleh aturan.
2. Platform Admin dan otorisasi berbasis peran.
3. Persetujuan Business Entity.
4. Akun personal Farmer.
5. Keanggotaan Distributor/Retailer di bawah Business Entity.
6. CRUD Product.
7. CRUD Batch.
8. Inventory.
9. Buku besar pergerakan inventory (Inventory movement ledger).
10. Alur pembelian/penerimaan/transfer (Purchase/receive/transfer flow).
11. Alur pesanan/penjualan (Order/sale flow).
12. Pencatatan dan perhitungan waste.
13. Keterlacakan batch.
14. Pencarian/filter/pengurutan/paginasi (Search/filter/sort/pagination).
15. Unggah gambar/PDF.
16. Validasi dan notifikasi.
17. Penanganan kesalahan global (Global error handling).
18. Desain database relasional yang diwajibkan.
19. Dokumentasi API.
20. README, diagram alir, seed data, monorepo GitHub.

## P1 — Implementasikan Jika P0 Sudah Stabil

- Grafik dasbor.
- Riwayat harga dan visibilitas margin.
- Analitik waste lanjutan.
- Usia inventory.
- Peringatan stok rendah/kedaluwarsa.
- Laporan entitas.
- Keterlacakan publik yang lebih kaya.
- Layanan email untuk reset kata sandi jika belum ditangani oleh implementasi lain yang diterima.

## P2 — Tujuan Tambahan

- Gerbang pembayaran Midtrans.
- Alur kerja status pengiriman.
- Kode QR untuk keterlacakan batch.
- Halaman batch publik.
- Analisis rekomendasi/permintaan.
- Prakiraan lanjutan.

## Pemotongan Cakupan Eksplisit

Jangan mengimplementasikan pelacakan pengiriman GPS secara real-time, laporan akuntansi yang kompleks, dompet perbankan/pembayaran, fitur sosial, atau marketplace penuh kecuali jika seluruh kebutuhan P0 telah selesai dan diuji.
