# CICLOVELA

**Agricultural Supply Chain, Inventory & Product Traceability Platform**

CICLOVELA adalah platform rantai pasok (supply chain) berbasis B2B/B2C yang dirancang khusus untuk mencatat pergerakan komoditas pertanian mulai dari petani, distributor, pengecer (retailer), hingga ke tangan konsumen akhir. Aplikasi ini memastikan transparansi inventaris, integritas harga, serta memelihara *traceability* (lacak jejak) dari suatu batch panen.

---

## Fitur Utama (Core Features)

1. **Authentication & RBAC (Role-Based Access Control)**
   - Autentikasi berbasis JWT (JSON Web Token) tersandi secara *Stateless*.
   - Hak akses berjenjang: Platform Admin, Farmer (Petani), dan Consumer/Pelaku Bisnis.
   - Pendaftaran dan persetujuan Entitas Bisnis terpusat.
   - Alur Lupa dan Reset Password yang terintegrasi dengan Email (SMTP).

2. **Manajemen Katalog & Batch Panen**
   - Pencatatan master data Produk dan Kategori.
   - Sistem *Batch-Based Inventory*: Setiap panen dicatat dalam *batch* spesifik yang memiliki kuantitas, tanggal panen, kualitas (Grade), dan tanggal kedaluwarsa tersendiri.

3. **Core Inventory & Immutable Movement Ledger**
   - Stok inventaris dipisahkan dengan sangat ketat berdasarkan entitas pemilik dan ID batch.
   - *Inventory Movements* bersifat *Immutable* (tidak bisa dihapus/diubah). Semua perubahan stok (pembelian, penjualan, pembuangan limbah, koreksi) wajib memiliki rekam jejak.
   - Perlindungan tingkat database: *Kuantitas inventaris tidak akan pernah bernilai negatif*.

4. **Transaksi Inbound & Outbound (Supply Chain)**
   - *Purchase* (Pembelian masuk): Memindahkan kepemilikan dan stok dari Petani ke Distributor.
   - *Sales* (Penjualan keluar): Mendistribusikan barang dari Distributor ke Retailer (B2B) atau langsung ke Konsumen akhir (B2C).

5. **Pencatatan Limbah (Waste Management)**
   - Mencatat limbah yang disebabkan oleh pembusukan, kerusakan, gagal standar kualitas, maupun barang kedaluwarsa.
   - Menurunkan stok inventaris secara otomatis dan mencatatnya ke dalam ledger limbah.

6. **Lacak Produk (Traceability)**
   - Kemampuan bagi publik/konsumen untuk melacak asal-usul sepotong tomat atau sayuran.
   - Menampilkan *Timeline* perjalanan komoditas (panen -> distribusi -> limbah -> konsumsi) berdasarkan pencarian Kode Batch.

---

## Teknologi yang Digunakan

**Frontend (Client Side):**
- **React.js 18** (Vite) + **TypeScript**
- **Tailwind CSS** (Styling & Responsiveness)
- **React Router DOM** (Client-side Routing)
- **Axios** (API Client & Interceptor)
- **Recharts** (Grafik Analitik)
- **Lucide React** (Ikonografi UI)
- **React Hot Toast** (Notifikasi)

**Backend (Server Side - Microservices Architecture):**
- **Java 21**
- **Spring Boot 3.2 & 4.1.x**
- **Spring Cloud Gateway** (API Gateway / Load Routing)
- **Spring Security** (Autentikasi & Otorisasi)
- **Spring Data JPA & Hibernate** (ORM)
- **JSON Web Token (jjwt)** (Otentikasi Stateless)
- **Springdoc OpenAPI / Swagger** (Dokumentasi API Otomatis)

**Database:**
- **PostgreSQL 18**
- Relational Database Normalization (3NF)
- UUID Primary Keys & Soft Delete Implementation

---

## Arsitektur Microservices

Platform CICLOVELA dibangun di atas pola desain mikrolayanan (microservices) untuk memisahkan domain masalah menjadi unit yang bisa dikelola mandiri:

1. **API Gateway (`port 8080`)**: Pintu masuk utama. Mengarahkan traffic frontend menuju layanan yang sesuai.
2. **Auth Service (`port 8081`)**: Bertanggung jawab penuh terhadap registrasi, otentikasi JWT, hashing password (Bcrypt), dan pengiriman email reset password.
3. **Catalog Service (`port 8082`)**: Layanan manajemen master Produk, Kategori, dan Batch panen baru.
4. **Inventory Service (`port 8083`)**: Pusat kebenaran (Source of Truth) untuk kuantitas stok gudang. Menangani mutasi pergerakan barang (Immutable Ledger), pencatatan limbah (Waste), serta pengelolaan pendaftaran Entitas Bisnis.
5. **Order Service (`port 8084`)**: Mengelola logika alur transaksi pemesanan pasokan (Purchases) maupun pengeluaran (Sales).
6. **Traceability Service (`port 8085`)**: Layanan *Read-Only* yang bertugas menyajikan data gabungan (Timeline Event) secara aman dan transparan kepada publik tanpa mengekspos data rahasia perusahaan.

---

## Struktur Folder Proyek

```text
ciclovela/
├── backend/
│   ├── api-gateway/            # Routing Service (Spring Cloud Gateway)
│   ├── auth-service/           # Layanan Otentikasi
│   ├── catalog-service/        # Layanan Master Produk & Batch
│   ├── inventory-service/      # Layanan Gudang, Perusahaan & Limbah
│   ├── order-service/          # Layanan Transaksi Jual Beli
│   └── traceability-service/   # Layanan Lacak Riwayat Pasokan
├── frontend/                   # UI React berbasis Vite
│   ├── public/                 
│   └── src/
│       ├── api/                # Konfigurasi Axios Client
│       ├── components/         # Komponen Modular (Layout, UI, dll)
│       ├── context/            # React Context (Auth State)
│       ├── pages/              # Antarmuka Layar (Dashboard, Auth, dll)
│       └── ...
├── docs/                       # Dokumentasi arsitektur dan aturan bisnis 
│   ├── 04-database/
│   │   ├── ciclovela_db.sql    # Schema utama database (Table Creation)
│   │   └── seed_data.sql       # Data dummy (20+ data per table)
│   └── ...
└── AGENTS.md                   # Konteks persistensi AI
```

---

## Cara Instalasi & Menjalankan Aplikasi Lokal

### Persiapan Prasyarat
1. Telah terinstall **Java 21** atau lebih tinggi.
2. Telah terinstall **Node.js** (v18+) dan NPM.
3. Telah terinstall **PostgreSQL**.
4. (Opsional tapi disarankan) Menggunakan DBeaver atau pgAdmin.

### Langkah 1: Setup Database
1. Buat database baru di PostgreSQL bernama `ciclovela`.
2. Buka DBeaver/pgAdmin, dan jalankan script schema utama:
   `docs/04-database/ciclovela_db.sql`
3. Setelah tabel terbuat, isikan data awal dengan menjalankan script:
   `docs/04-database/seed_data.sql`

### Langkah 2: Jalankan Layanan Backend (Microservices)
Anda perlu membuka beberapa jendela terminal/Command Prompt yang terpisah dan berpindah ke masing-masing folder layanan, lalu menjalankan Maven Wrapper-nya.

**Untuk Pengguna Windows (Command Prompt):**
```bash
cd backend\api-gateway && mvnw.cmd spring-boot:run
cd backend\auth-service && mvnw.cmd spring-boot:run
cd backend\catalog-service && mvnw.cmd spring-boot:run
cd backend\inventory-service && mvnw.cmd spring-boot:run
cd backend\order-service && mvnw.cmd spring-boot:run
cd backend\traceability-service && mvnw.cmd spring-boot:run
```
*(Pastikan semua layanan 8080 s/d 8085 ini berjalan di background)*.

### Langkah 3: Jalankan Frontend (React)
1. Buka terminal baru dan masuk ke folder `frontend`.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembang Vite:
   ```bash
   npm run dev
   ```
4. Buka Browser dan kunjungi `http://localhost:5173`.

---

## Daftar Akun Demo (Berdasarkan Seed Data)

Karena Anda telah menjalankan `seed_data.sql`, Anda dapat mencoba menggunakan aplikasi layaknya aktor di dunia nyata dengan menggunakan akun-akun demo berikut. Seluruh akun memiliki kata sandi yang sama.

**Kata Sandi Global:** `password`

| Peran (Role) | Alamat Email | Kemampuan |
|---|---|---|
| **Platform Admin** | `admin1@mailinator.com` | Menyetujui bisnis baru, mengatur master kategori, mengawasi semua user. |
| **Petani (Farmer)** | `farmer1@mailinator.com` | Membuat produk baru, mendaftarkan *batch* panen baru. |
| **Distributor** | `distributor1@mailinator.com` | Membeli stok dari petani, mencatat kerugian/limbah, menjual ke retailer. |
| **Retailer (Toko)** | `retailer1@mailinator.com` | Membeli stok dari distributor, menjual ke konsumen. |

*(Anda dapat menggunakan `distributor2`, `farmer3`, dst. jika diperlukan).*
