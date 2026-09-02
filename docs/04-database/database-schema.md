# Skema Database CICLOVELA

## Gambaran Entitas

CICLOVELA menggunakan entitas berikut:

### users

Menyimpan seluruh pengguna platform.

Peran utama:

- PLATFORM_ADMIN
- FARMER
- CONSUMER

### business_entities

Mewakili organisasi bisnis yang beroperasi di CICLOVELA.

Tipe bisnis:

- DISTRIBUTOR
- RETAILER

Distributor dan retailer wajib beroperasi melalui Business Entity yang telah disetujui.

### business_memberships

Menghubungkan user dengan Business Entity.

Digunakan agar satu Business Entity dapat memiliki beberapa anggota.

### product_categories

Master kategori produk pertanian.

### products

Master produk yang diperdagangkan.

### batches

Mewakili batch produk tertentu.

Batch menyimpan:

- produk
- farmer
- kode batch
- tanggal panen
- kuantitas awal
- satuan
- tingkat kualitas
- tanggal kedaluwarsa
- status

Tidak terdapat field tanggal_produksi.

Inventaris CICLOVELA berbasis batch.

### inventory_accounts

Mewakili pemilik inventaris.

Inventaris dapat dimiliki oleh:

- pengguna individu
- entitas bisnis

Satu akun inventaris hanya memiliki satu pemilik.

### inventories

Menyimpan kuantitas aktual suatu batch yang dimiliki oleh akun inventaris.

Relasi utama:

akun inventaris → batch → kuantitas

### inventory_movements

Mencatat seluruh perubahan inventaris.

Contoh:

- pembelian masuk
- transfer masuk
- transfer keluar
- penjualan keluar
- limbah keluar
- penyesuaian

Pergerakan inventaris bersifat kekal (immutable).

### purchases

Mencatat transaksi pembelian dari farmer kepada entitas bisnis.

Alur utama:

Farmer → Distributor

### purchase_items

Menyimpan detail batch, kuantitas, dan harga pada pembelian.

### sales

Mencatat transaksi penjualan.

Alur:

Distributor → Retailer

atau:

Retailer → Consumer

### sale_items

Menyimpan detail batch, kuantitas, dan harga pada penjualan.

### wastes

Mencatat produk yang tidak dapat dijual atau digunakan.

Limbah selalu terkait dengan:

- batch
- inventaris
- kuantitas
- alasan

Limbah merupakan bagian penting dari manajemen inventaris.

### deliveries

Menyimpan informasi pengiriman.

Untuk MVP tidak menggunakan pelacakan GPS real-time.

### payments

Menyimpan informasi pembayaran.

Payment gateway seperti Midtrans merupakan fitur tambahan dan bukan dependensi utama MVP.

## Rantai Pasok

CICLOVELA memiliki alur utama:

Farmer
↓
Distributor
↓
Retailer
↓
Consumer

Farmer dapat beroperasi sebagai individu.

Distributor wajib berada di bawah Business Entity.

Retailer wajib berada di bawah Business Entity.

Consumer dapat beroperasi sebagai individu.

## Prinsip Inventaris

Inventaris tidak disimpan hanya berdasarkan produk.

Contoh:

Tomato
├── Batch A
│   ├── Tanggal Panen
│   └── Tanggal Kedaluwarsa
│
├── Batch B
│   ├── Tanggal Panen
│   └── Tanggal Kedaluwarsa
│
└── Batch C
    ├── Tanggal Panen
    └── Tanggal Kedaluwarsa

Setiap batch dapat memiliki tanggal kedaluwarsa yang berbeda.

Karena itu inventaris harus selalu dapat dilacak sampai ke batch.

## Keterlacakan Harga

Harga dicatat pada level item transaksi.

Harga pembelian:

Farmer → Distributor

Harga penjualan:

Distributor → Retailer

atau:

Retailer → Consumer

CICLOVELA tidak menentukan harga jual.

Sistem mencatat harga transaksi agar perbedaan harga antar rantai pasok dapat ditelusuri.

## Pelacakan Limbah

Limbah mengurangi inventaris batch yang terdampak.

Contoh:

Batch A = 100 KG

50 KG terjual.

20 KG rusak.

Maka:

Inventaris tersedia = 30 KG
Limbah = 20 KG
Terjual = 50 KG

Limbah tidak hanya menjadi laporan, tetapi merupakan bagian dari transaksi inventaris.