# CICLOVELA Database Schema

## Entity Overview

CICLOVELA menggunakan entity berikut:

### users

Menyimpan seluruh pengguna platform.

Role utama:

- PLATFORM_ADMIN
- FARMER
- CONSUMER

### business_entities

Mewakili organisasi bisnis yang beroperasi di CICLOVELA.

Business type:

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

- product
- farmer
- batch code
- harvest date
- initial quantity
- unit
- quality grade
- expiry date
- status

Tidak terdapat field production_date.

Inventory CICLOVELA berbasis batch.

### inventory_accounts

Mewakili pemilik inventory.

Inventory dapat dimiliki oleh:

- individual user
- business entity

Satu inventory account hanya memiliki satu owner.

### inventories

Menyimpan quantity aktual suatu batch yang dimiliki oleh inventory account.

Relasi utama:

inventory account → batch → quantity

### inventory_movements

Mencatat seluruh perubahan inventory.

Contoh:

- purchase in
- transfer in
- transfer out
- sale out
- waste out
- adjustment

Inventory movement bersifat immutable.

### purchases

Mencatat transaksi pembelian dari farmer kepada business entity.

Flow utama:

Farmer → Distributor

### purchase_items

Menyimpan detail batch, quantity, dan harga pada purchase.

### sales

Mencatat transaksi penjualan.

Flow:

Distributor → Retailer

atau:

Retailer → Consumer

### sale_items

Menyimpan detail batch, quantity, dan harga pada sale.

### wastes

Mencatat produk yang tidak dapat dijual atau digunakan.

Waste selalu terkait dengan:

- batch
- inventory
- quantity
- reason

Waste merupakan bagian penting dari inventory management.

### deliveries

Menyimpan informasi pengiriman.

Untuk MVP tidak menggunakan real-time GPS tracking.

### payments

Menyimpan informasi pembayaran.

Payment gateway seperti Midtrans merupakan fitur tambahan dan bukan dependency utama MVP.

## Supply Chain

CICLOVELA memiliki alur utama:

Farmer
↓
Distributor
↓
Retailer
↓
Consumer

Farmer dapat beroperasi sebagai individual.

Distributor wajib berada di bawah Business Entity.

Retailer wajib berada di bawah Business Entity.

Consumer dapat beroperasi sebagai individual.

## Inventory Principle

Inventory tidak disimpan hanya berdasarkan product.

Contoh:

Tomato
├── Batch A
│   ├── Harvest Date
│   └── Expiry Date
│
├── Batch B
│   ├── Harvest Date
│   └── Expiry Date
│
└── Batch C
    ├── Harvest Date
    └── Expiry Date

Setiap batch dapat memiliki expiry date yang berbeda.

Karena itu inventory harus selalu dapat dilacak sampai ke batch.

## Price Traceability

Harga dicatat pada level transaction item.

Purchase price:

Farmer → Distributor

Sale price:

Distributor → Retailer

atau:

Retailer → Consumer

CICLOVELA tidak menentukan harga jual.

Sistem mencatat harga transaksi agar perbedaan harga antar supply chain dapat ditelusuri.

## Waste Tracking

Waste mengurangi inventory batch yang terdampak.

Contoh:

Batch A = 100 KG

50 KG terjual.

20 KG rusak.

Maka:

Available inventory = 30 KG
Waste = 20 KG
Sold = 50 KG

Waste tidak hanya menjadi laporan, tetapi merupakan bagian dari inventory transaction.