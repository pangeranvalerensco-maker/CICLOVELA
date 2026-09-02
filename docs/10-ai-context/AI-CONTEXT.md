# CICLOVELA - KONTEKS PENGEMBANGAN AI

## PENTING

Dokumen ini adalah konteks proyek permanen untuk agen pengkodean AI.

Sebelum memodifikasi, membuat, menghapus, atau memfaktorkan ulang kode,
agen AI WAJIB membaca dokumen ini dan dokumen relevan lainnya
di dalam /docs.

AI TIDAK BOLEH menciptakan persyaratan bisnis sendiri.

Jika sebuah persyaratan tidak jelas atau bertentangan dengan dokumentasi yang ada,
BERHENTI dan laporkan konflik tersebut sebelum mengimplementasikannya.

---

# 1. IDENTITAS PROYEK

Nama proyek: CICLOVELA

CICLOVELA adalah sistem manajemen rantai pasok dan inventaris agribisnis
yang berfokus pada produk pertanian.

Sistem ini menghubungkan:

Farmer
    ↓
Distributor
    ↓
Retailer
    ↓
Consumer

Proyek ini BUKAN murni sistem akuntansi.

Proyek ini BUKAN marketplace umum.

Proyek ini BUKAN sistem manajemen organisasi umum.

Fokus utamanya adalah:

- keterlacakan produk pertanian
- manajemen inventaris
- manajemen batch
- manajemen kedaluwarsa
- transaksi rantai pasok
- manajemen limbah (waste management)
- verifikasi entitas bisnis
- transparansi harga

# 2. KONSEP INTI

Sistem inventaris adalah salah satu fitur inti dari CICLOVELA.

Inventaris tidak boleh diperlakukan hanya sebagai field stok integer biasa.

Setiap kuantitas inventaris harus dikaitkan dengan batch produk.

Sebuah batch memiliki:

- kode batch
- produk
- farmer
- tanggal panen
- kuantitas awal
- satuan
- tingkat kualitas
- tanggal kedaluwarsa
- status

Batch yang berbeda dari produk yang sama dapat memiliki perbedaan pada:

- kuantitas
- tanggal panen
- tanggal kedaluwarsa
- tingkat kualitas
- harga pembelian

# 3. RANTAI PASOK (SUPPLY CHAIN)

FARMER
  ↓
DISTRIBUTOR
  ↓
RETAILER
  ↓
CONSUMER

Farmer dapat beroperasi sebagai pengguna individu.

Distributor wajib beroperasi melalui Business Entity yang telah disetujui.

Retailer wajib beroperasi melalui Business Entity yang telah disetujui.

Consumer dapat beroperasi sebagai pengguna individu.

Sebuah entitas bisnis harus disetujui sebelum dapat melakukan
transaksi bisnis.

# 4. JANGAN BERASUMSI

Hal-hal berikut TIDAK BOLEH diasumsikan oleh AI:

- Jangan membuat entitas gudang (warehouse) kecuali didokumentasikan.
- Jangan membuat entitas pemasok (supplier) kecuali didokumentasikan.
- Jangan membuat manajemen karyawan kecuali didokumentasikan.
- Jangan mengubah CICLOVELA menjadi sistem akuntansi.
- Jangan menambahkan fitur mata uang kripto/blockchain.
- Jangan menambahkan layanan mikro (microservices) yang tidak perlu.
- Jangan menambahkan pelacakan pengiriman real-time kecuali didokumentasikan.
- Jangan mengintegrasikan Midtrans sebelum fase pembayaran disetujui.
- Jangan menambahkan entitas hanya karena entitas tersebut umum ada di sistem marketplace.