# CICLOVELA — SUMBER KEBENARAN (SOURCE OF TRUTH)

Dokumen ini adalah referensi kanonikal untuk CICLOVELA.

Setiap pengembang, agen AI coding, peninjau, atau kontributor harus membaca dan mengikuti dokumen ini sebelum memodifikasi sistem.

Jika sebuah implementasi bertentangan dengan dokumen ini, implementasi tersebut harus diubah kecuali persyaratan itu sendiri telah direvisi dan didokumentasikan secara formal.

Saran yang dihasilkan oleh AI tidak mengesampingkan persyaratan CICLOVELA yang telah disetujui.

## 1. Identitas Tetap

**Proyek:** CICLOVELA

**Judul kerja:** Agricultural Supply Chain, Inventory & Product Traceability Platform

**Tesis inti:** CICLOVELA mencatat siklus hidup dan pergerakan produk pertanian melintasi Farmer → Distributor → Retailer → Consumer sekaligus mempertahankan riwayat inventaris, informasi batch, kepemilikan, nilai, kedaluwarsa, dan catatan limbah (waste).

## 2. Apa Itu CICLOVELA

CICLOVELA adalah platform rantai pasok dan inventaris yang terkendali.

Pertanyaan bisnis utamanya adalah:

> Dari mana produk ini berasal, di mana posisinya sekarang, berapa jumlah yang tersisa, apa yang terjadi padanya, nilai apa yang melekat padanya di setiap tahap, dan porsi mana yang menjadi waste?

## 3. Apa Yang Bukan CICLOVELA

- Bukan murni aplikasi akuntansi.
- Bukan sistem manajemen organisasi umum.
- Bukan murni marketplace.
- Bukan aplikasi kurir/GPS real-time.
- Bukan aplikasi pajak.
- Bukan aplikasi perbankan.
- Bukan jejaring sosial tanpa batas.

Integrasi pembayaran dan status pengiriman dapat ada sebagai fitur pendukung, namun fitur-fitur tersebut tidak mendefinisikan ulang produk inti.

## 4. Aktor Tetap

### Platform Admin

Mengoperasikan platform CICLOVELA. Bertanggung jawab atas moderasi tingkat platform dan persetujuan Business Entity.

### Farmer

Pengguna personal yang dapat mendaftarkan produk/batch pertanian dan menawarkan barang ke dalam rantai pasok. Farmer tidak diwajibkan untuk bergabung dengan Business Entity pada tahap MVP.

### Business Entity

Organisasi terverifikasi yang merepresentasikan distributor, pengecer, atau partisipan bisnis lainnya.

### Entity Admin

Mengelola anggota dan data operasional di dalam sebuah Business Entity. Ini berbeda dengan Platform Admin.

### Distributor

Harus beroperasi di bawah sebuah Business Entity. Membeli/menerima produk dari Farmer dan dapat mentransfer/menjualnya lebih lanjut.

### Retailer

Harus beroperasi di bawah sebuah Business Entity. Membeli/menerima produk dari distributor dan menjualnya kepada konsumen.

### Consumer

Pengguna personal yang dapat menelusuri produk, melakukan pemesanan, dan melihat informasi keterlacakan yang diizinkan.

## 5. Siklus Hidup Tetap

```text
Farmer
  ↓
Product / Batch
  ↓
Distributor
  ↓
Retailer
  ↓
Consumer
  ↓
Product End-of-Life / Waste
```

Siklus hidup ini berbasis batch (batch-aware). Product adalah definisi umum; Batch merepresentasikan kelompok produksi/panen spesifik dengan kuantitas, tanggal, kualitas, kepemilikan, dan kedaluwarsanya sendiri.

## 6. Domain Inti Tetap

1. Identity & access
2. Business Entity
3. Product
4. Batch
5. Inventory
6. Inventory Movement
7. Supply-chain transaction / transfer
8. Order / sale
9. Waste
10. Traceability

Domain pendukung:

11. Payment
12. Delivery
13. Notification
14. Analytics / dashboard

Domain pendukung memiliki prioritas lebih rendah dibandingkan domain inti.

## 7. Prinsip Bisnis yang Tidak Dapat Ditawar

- Inventory harus dapat dijelaskan melalui pergerakan (movements).
- Informasi batch harus dipertahankan.
- Kedaluwarsa dapat berbeda antar batch dari produk yang sama.
- Waste merupakan peristiwa bisnis utama (first-class), bukan sekadar catatan (note field).
- Perubahan kepemilikan harus dapat dilacak.
- Perubahan harga antar tahap rantai pasok harus dicatat daripada ditimpa diam-diam.
- Izin berbasis peran harus ditegakkan di sisi server (server-side).
- Pembuatan Business Entity harus dikontrol/disetujui oleh Platform Admin.
- Keterlacakan yang menghadap konsumen tidak boleh mengekspos data bisnis internal yang sensitif.
- Data master yang dihapus harus dapat dipulihkan melalui soft delete jika diwajibkan oleh aturan proyek.

## 8. Filosofi Cakupan (Scope Philosophy)

MVP harus mendalam dan koheren, bukan luas dan tidak selesai.

Urutan prioritas:

**P0:** autentikasi, otorisasi, entities, products, batches, inventory, movement, transfers, orders/sales, waste, traceability, infrastruktur proyek yang diwajibkan.

**P1:** analitik dasbor, riwayat harga, filter lanjutan, laporan, notifikasi, keterlacakan yang lebih kaya.

**P2:** Midtrans/payment gateway, alur kerja pengiriman (delivery), kode QR/halaman keterlacakan publik, analitik lanjutan/rekomendasi.

## 9. Kontrol Perubahan

Setiap usulan fitur harus menjawab:

1. Masalah bisnis apa yang diselesaikannya?
2. Aktor mana yang menggunakannya?
3. Entitas domain mana yang dipengaruhinya?
4. Aturan bisnis apa yang diperkenalkannya?
5. Apakah mengancam jadwal tiga minggu?
6. Apakah ini P0, P1, atau P2?

Jika usulan tersebut tidak memperbaiki siklus hidup inti, kemungkinan hal itu bukan prioritas.
Aturan yang Tidak Dapat Ditawar

Struktur Bisnis

Farmer dapat beroperasi sebagai personal user.
Distributor wajib berada di dalam Business Entity.
Retailer wajib berada di dalam Business Entity.
Consumer dapat beroperasi sebagai personal user.
Business Entity baru dapat digunakan setelah approval Platform Admin.
Distributor dan Retailer memperoleh kewenangan melalui Business Membership, bukan role bebas yang dapat dipilih tanpa konteks entity.

Rantai Pasok (Supply Chain)

FARMER
   ↓
DISTRIBUTOR
   ↓
RETAILER
   ↓
CONSUMER

Alur tersebut merupakan alur utama dan wajib untuk MVP.

Tidak diperbolehkan pada MVP:

Farmer → Retailer
Farmer → Consumer
Distributor → Consumer

Produk & Batch (Product & Batch)

Product merepresentasikan jenis produk.
Batch merepresentasikan kelompok produksi/panen tertentu.
Product dapat memiliki banyak Batch.
Batch memiliki quantity awal, quality grade, harvest date, dan expiry date.
Perubahan ownership tidak membuat Batch baru.
Satu Batch dapat tersebar pada beberapa Inventory Account.
Sebagian quantity Batch dapat dijual atau dipindahkan.

Inventaris (Inventory)

Inventory tidak boleh negatif.
reserved_quantity tidak boleh lebih besar daripada quantity.
Perubahan inventory wajib menghasilkan Inventory Movement.
Historical Inventory Movement tidak boleh diedit.
Transaksi yang perlu dibatalkan harus menggunakan reversal/cancellation mechanism.
Quantity awal Batch tidak boleh diubah akibat transaksi atau waste.

Limbah (Waste)

Waste merupakan core feature.
Waste harus memiliki quantity, batch, inventory, reason, actor, dan timestamp.
Waste tidak boleh melebihi available inventory.
Waste menghasilkan WASTE_OUT Inventory Movement.
Waste tidak mengubah initial_quantity Batch.
Expired product tidak otomatis dihapus dari inventory tanpa pencatatan waste.

Kedaluwarsa (Expiry)

Batch yang telah expired tidak boleh digunakan untuk transaksi penjualan baru.
Expired stock tetap dapat tercatat di inventory sampai dilakukan waste handling.
Expiry harus ditentukan pada level Batch, bukan Product.

Transaksi (Transaction)

Purchase tidak langsung menambah inventory ketika dibuat.
Inventory berpindah setelah Purchase mencapai status yang sesuai.
Sale tidak boleh mengurangi inventory yang tidak tersedia.
Completed transaction tidak boleh dihapus secara fisik.
Historical transaction harus tetap dapat ditelusuri.

Cakupan (Scope)

CICLOVELA bukan:

accounting system;
personal finance application;
marketplace umum;
realtime delivery tracking system;
GPS logistics platform;
full ERP.

CICLOVELA adalah:

Supply chain, inventory, product traceability, and waste management platform for agricultural products.

Payment gateway seperti Midtrans dan fitur delivery lebih lanjut berada pada optional/P2 scope dan tidak boleh menghambat penyelesaian core system.