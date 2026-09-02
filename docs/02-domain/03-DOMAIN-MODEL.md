# Domain Model — Konseptual

## Entitas Inti

### User

Akun identitas dan autentikasi.

### FarmerProfile

Informasi tambahan untuk pengguna Farmer.

### BusinessEntity

Organisasi terverifikasi yang berpartisipasi dalam rantai pasok.

### Membership

Hubungan antara User dan BusinessEntity dengan peran entitas tertentu.

### Product

Definisi produk secara umum.

### Batch

Lot produksi/panen spesifik milik sebuah Product.

### Inventory

Posisi stok saat ini untuk konteks pemilik/lokasi/batch.

### InventoryMovement

Catatan kekal atau yang bersifat penambahan terus (append-oriented) yang mendeskripsikan perubahan stok.

### SupplyTransaction

Peristiwa bisnis sisi pembelian/transfer/penjualan yang menghubungkan antar aktor/entitas.

### Order

Permintaan pembelian/pesanan oleh konsumen.

### OrderItem

Alokasi product/batch dalam suatu Order.

### WasteRecord

Pengurangan stok yang disebabkan oleh waste.

### Attachment

Metadata gambar/PDF/dokumen yang diunggah jika diperlukan.

## Hubungan Konseptual

```text
User 1──0..1 FarmerProfile
User 1──N Membership N──1 BusinessEntity
Product 1──N Batch
Batch 1──N InventoryMovement
Batch 1──N WasteRecord
Batch 1──N SupplyTransaction
Order 1──N OrderItem
OrderItem N──1 Product
OrderItem N──0..1 Batch
```

ERD akhir harus dinormalisasi dan secara eksplisit mendemonstrasikan hubungan One-to-One, One-to-Many, Many-to-One, dan Many-to-Many seperti yang diwajibkan oleh proyek ini.
