# Aturan Bisnis

## Produk vs Batch

Sebuah Product adalah definisi umum. Sebuah Batch adalah lot yang spesifik.

Satu Product dapat memiliki banyak Batches.

Contoh:

```text
Product: Tomato
├── Batch A — harvested 20 Aug — expires 27 Aug
└── Batch B — harvested 22 Aug — expires 30 Aug
```

Kedaluwarsa harus disimpan pada tingkat batch ketika hal tersebut dapat bervariasi berdasarkan produksi/panen.

## Aturan Inventaris (Inventory Rule)

Inventory saat ini harus dapat dijelaskan dari pergerakan inventory (inventory movements).

Formula konseptual:

```text
Current Stock = Opening + Inbound - Outbound - Waste + Adjustments
```

Tipe pergerakan yang persis harus difinalisasi dalam domain model sebelum diimplementasikan.

## Aturan Kepemilikan (Ownership Rule)

Sebuah transfer merepresentasikan perubahan atau pergerakan barang yang terkontrol dari aktor/entitas sumber menuju aktor/entitas tujuan.

Sistem harus mencatat:

- sumber (source);
- tujuan (destination);
- batch;
- kuantitas (quantity);
- satuan (unit);
- waktu transaksi (transaction time);
- harga transaksi (transaction price) jika berlaku;
- status.

## Aturan Harga (Price Rule)

CICLOVELA tidak memaksakan satu harga pasar yang tunggal.

Sistem mencatat nilai transaksi sehingga sistem dapat menunjukkan bagaimana nilai produk berubah di seluruh rantai pasok.

Contoh:

```text
Farmer → Distributor: Rp10,000/kg
Distributor → Retailer: Rp14,000/kg
Retailer → Consumer: Rp20,000/kg
```

Sistem mencatat ini sebagai transaksi-transaksi yang terpisah, bukan dengan menimpa harga awal.

## Aturan Limbah (Waste Rule)

Waste adalah peristiwa bisnis yang mengurangi stok.

Waste harus mereferensikan sebuah batch dan kuantitas.

Alasan waste sebaiknya dienumerasi (enum), contoh:

- EXPIRED
- SPOILED
- DAMAGED
- QUALITY_FAILURE
- UNSOLD
- OTHER

Waste harus tercermin dalam riwayat inventory.

## Aturan Kedaluwarsa (Expiry Rule)

Risiko kedaluwarsa bersifat spesifik-batch. Sistem tidak boleh berasumsi bahwa semua unit dari sebuah Product akan kedaluwarsa pada tanggal yang sama.

## Aturan Keterlacakan (Traceability Rule)

Sistem harus mampu merekonstruksi riwayat relevan dari sebuah batch dari titik asal melalui peristiwa rantai pasok selanjutnya.

## Aturan Visibilitas Data

Nilai transaksi internal dan data pribadi/bisnis tidak boleh secara otomatis menjadi data keterlacakan publik.

Keterlacakan yang menghadap publik/konsumen harus menggunakan proyeksi eksplisit yang aman dari data internal.
