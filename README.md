# CICLOVELA

**Agricultural Supply Chain, Inventory & Product Traceability Platform**

CICLOVELA adalah platform manajemen rantai pasok agrikultur B2B dan B2C yang dikembangkan dengan arsitektur **Microservices**. Platform ini memastikan transparansi harga, integritas pergerakan inventaris, serta kemampuan pelacakan (traceability) riwayat komoditas pertanian mulai dari petani hingga ke tangan konsumen.

## 🌟 Fitur Utama
- **Immutable Ledger**: Seluruh pencatatan pergerakan stok (pembelian, penjualan, pembuangan limbah) dikunci permanen agar tidak bisa dimanipulasi, menjamin _traceability_.
- **Gudang Inventaris Dinamis**: Gudang menyesuaikan otomatis berdasarkan _role_ pengguna (Personal untuk Petani, atau Gudang Kolektif untuk Entitas Bisnis).
- **Manajemen Limbah (Waste)**: Fitur pelaporan komoditas busuk/kedaluwarsa yang otomatis memotong stok secara transparan.
- **Traceability Publik**: Konsumen dapat melacak keaslian produk dari mana asalnya hanya dengan memasukkan "Kode Batch" di halaman pencarian.
- **Role-Based Access Control (RBAC)**: Fitur dibatasi dengan aman di backend menggunakan Spring Security (Platform Admin, Farmer, Distributor, Retailer, Consumer).

## 🛠️ Tech Stack
- **Backend**: Java 21, Spring Boot 4.1.x, Spring Data JPA, Spring Security (JWT), PostgreSQL 18
- **Arsitektur**: Microservices (Auth, Catalog, Inventory, Order, Traceability) + Spring Cloud Gateway
- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4, Recharts, React Router, i18next (Multi-bahasa ID/EN)

## 📦 Struktur Folder
```
CICLOVELA/
├── backend/
│   ├── api-gateway/         # Port 8080 (Titik masuk utama)
│   ├── auth-service/        # Port 8081 (Manajemen user & JWT)
│   ├── catalog-service/     # Port 8082 (Katalog produk & batch)
│   ├── inventory-service/   # Port 8083 (Manajemen gudang & entitas bisnis)
│   ├── order-service/       # Port 8084 (Transaksi jual-beli supply chain)
│   └── traceability-service/# Port 8085 (History tracking view)
├── frontend/                # Port 5173 (React SPA)
└── docs/                    # Flowcharts & Database Schema SQL
```

## 🚀 Cara Menjalankan Secara Lokal

### 1. Database
Pastikan PostgreSQL Anda berjalan di `localhost:5432` dengan pengguna `postgres` dan sandi `postgres`. Buat database bernama `ciclovela`:
```bash
# Di psql:
CREATE DATABASE ciclovela;
```
*(Catatan: Anda bisa mengubah konfigurasi kredensial pada `application.yml` masing-masing microservice jika menggunakan username/password lain).*

**Seeding Data (Opsional tapi disarankan):**
Jalankan script `docs/04-database/realistic_seed.sql` di database `ciclovela` Anda untuk mendapatkan data dummy lengkap siap demo.

### 2. Backend (Microservices)
Anda perlu menjalankan keenam layanan ini secara berurutan. Buka terminal berbeda untuk setiap *service* dan jalankan:
```bash
cd backend/[nama-service]
./mvnw spring-boot:run
```

### 3. Frontend
Pastikan Anda sudah menginstal Node.js:
```bash
cd frontend
npm install
npm run dev
```
Akses aplikasi melalui `http://localhost:5173`.

## 🔑 Akun Demo (Seeder)
Gunakan kredensial berikut untuk menguji *role-based workflow*. **Semua akun menggunakan password yang sama: `password`**.

| Role | Nama | Email | Fungsi |
|---|---|---|---|
| **Platform Admin** | Budi Admin | `admin1@mailinator.com` | Menyetujui pendaftaran entitas bisnis dan memantau user. |
| **Farmer (Petani)** | Pak Yanto | `farmer2@mailinator.com` | Membuat produk, mendaftarkan batch panen, memonitor stok panen pribadi. |
| **Distributor** | Agus Distributor | `distributor1@mailinator.com` | Membeli stok dari petani (Inbound) dan menjualnya ke retailer (Outbound). |
| **Retailer** | Toko Segar Pak Rudi | `retailer1@mailinator.com` | Membeli dari distributor dan menjual ke konsumen. |
| **Consumer** | Nisa Konsumen | `consumer1@mailinator.com` | Melacak asal-usul produk. |

## 📚 Dokumentasi API & Flowchart
Dokumentasi Flowchart (Arsitektur & Transaksi) tersedia di folder `docs/03-flowcharts.md`.
Dokumentasi Swagger dapat diakses di `/swagger-ui.html` pada masing-masing port *microservices*.
