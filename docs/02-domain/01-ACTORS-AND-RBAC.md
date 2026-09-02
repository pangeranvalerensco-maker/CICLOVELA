# Aktor, Peran & RBAC

## Peran Platform

### PLATFORM_ADMIN

Dapat:
- meninjau permintaan pembuatan Business Entity;
- menyetujui/menolak entitas;
- mengelola data referensi tingkat platform;
- memeriksa aktivitas platform;
- mengakses dasbor administratif.

### FARMER

Dapat:
- mengelola profil farmer sendiri;
- mengelola product/batch sendiri berdasarkan aturan kepemilikan;
- menawarkan/mentransfer barang ke dalam rantai pasok;
- memeriksa inventory/riwayat sendiri.

### CONSUMER

Dapat:
- menelusuri produk yang diizinkan;
- membuat pesanan;
- melihat pesanan sendiri;
- melihat keterlacakan yang diizinkan.

### ENTITY_ADMIN

Dapat:
- mengelola profil Business Entity;
- mengelola anggota;
- menugaskan peran entitas yang diizinkan;
- mengelola data operasional entitas.

### DISTRIBUTOR

Dapat:
- menerima/membeli barang;
- mengelola inventory entitas;
- mentransfer/menjual barang lebih lanjut;
- mencatat waste yang diizinkan;
- memeriksa riwayat batch yang relevan.

### RETAILER

Dapat:
- menerima barang;
- mengelola inventory eceran;
- menjual barang;
- mencatat waste yang diizinkan;
- memeriksa riwayat batch yang relevan.

## Aturan Registrasi

1. Semua orang memulai sebagai akun User.
2. Farmer dapat beroperasi sebagai peran pribadi.
3. Consumer dapat beroperasi sebagai peran pribadi.
4. Distributor dan Retailer harus beroperasi di bawah suatu Business Entity.
5. Pembuatan Business Entity memerlukan persetujuan Platform Admin.
6. Seorang User tidak boleh mendapatkan hak istimewa distributor/retailer hanya dengan mengubah nilai peran di sisi klien.
7. Otorisasi ditegakkan di bagian backend.

## Keanggotaan Entitas

Model konseptual yang disarankan:

```text
User ──< Membership >── BusinessEntity
                    │
                    └── EntityRole
```

Ini memungkinkan seorang pengguna untuk menjadi bagian dari sebuah entitas dengan peran yang telah ditetapkan tanpa harus melakukan hard-code terhadap semua peran bisnis secara langsung ke dalam tabel User.
