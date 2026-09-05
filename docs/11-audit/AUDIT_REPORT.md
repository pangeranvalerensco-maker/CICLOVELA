# Laporan Audit Implementasi: CICLOVELA PLATFORM

Laporan ini adalah hasil audit faktual berdasarkan *source code* saat ini (Backend Spring Boot, Frontend React Vite, Database PostgreSQL, dan Dokumentasi). Laporan ini dibuat secara objektif tanpa asumsi.

---

## 1. PROJECT STRUCTURE

- **Backend Services**: Terdapat 6 services aktif (`api-gateway`, `auth-service`, `catalog-service`, `inventory-service`, `order-service`, `traceability-service`).
- **Frontend Structure**: Monorepo SPA React di folder `/frontend`. Terstruktur dengan baik (`src/api`, `src/components`, `src/context`, `src/pages`, `src/utils`).
- **Framework/Library**:
  - Backend: Java 21, Spring Boot (v3.2.3 untuk Gateway, v4.1.1 untuk services lain), Spring Security, Spring Data JPA, Hibernate, jjwt (0.12.6), Springdoc OpenAPI.
  - Frontend: React 18, Vite, Tailwind CSS v4, React Router DOM, Axios, Recharts, Lucide React, React Hot Toast, i18next (Multibahasa).
- **Database Configuration**: PostgreSQL. Konfigurasi tersentralisasi di `application.yml` tiap service menunjuk ke `jdbc:postgresql://localhost:5432/ciclovela`. Skema menggunakan `ddl-auto: validate`.
- **Authentication**: Stateless JSON Web Token (JWT) dengan signature HMAC-SHA.
- **Authorization**: Role-based Access Control (RBAC) menggunakan `@PreAuthorize` pada level Controller.
- **API Gateway**: Menggunakan `spring-cloud-starter-gateway` berjalan di port `8080` dan merutekan traffic ke port `8081-8085` dengan konfigurasi CORS Global.
- **End-to-End**: **YA**. Proyek dapat dijalankan secara End-to-End dari frontend hingga database, didukung oleh data *seed*.

---

## 2. AUTHENTICATION

| Feature | Status | File / Endpoint / Notes |
|---|---|---|
| Register | **IMPLEMENTED** | `AuthService.java`, `POST /api/auth/register` |
| Login | **IMPLEMENTED** | `AuthService.java`, `POST /api/auth/login` |
| Logout | **IMPLEMENTED** | `AuthController.java`, `POST /api/auth/logout` (Stateless, hapus token di klien `AuthContext.tsx`) |
| Forgot Password | **IMPLEMENTED** | `AuthService.java`, `POST /api/auth/forgot-password` (Terintegrasi `EmailService` SMTP) |
| Reset Password | **IMPLEMENTED** | `AuthService.java`, `POST /api/auth/reset-password` |
| Password Hashing | **IMPLEMENTED** | `SecurityConfig.java`, menggunakan `BCryptPasswordEncoder`. |
| JWT/Session Handling | **IMPLEMENTED** | `JwtUtil.java`, `JwtAuthenticationFilter.java` |
| Auth Persistence | **IMPLEMENTED** | `AuthContext.tsx` menyimpan token di `localStorage` dan men-decode JWT untuk cek *expiry*. |
| Unauthorized Handling| **IMPLEMENTED** | `JwtAuthenticationEntryPoint.java` membalikkan `401 Unauthorized`. Interceptor Axios di frontend melempar user ke `/login`. |

---

## 3. RBAC DAN AUTHORIZATION

*Catatan Krusial:* Saat ini entitas JWT hanya memuat Base Role (`PLATFORM_ADMIN`, `FARMER`, `CONSUMER`). Entity Roles (`DISTRIBUTOR`, `RETAILER`) yang berada di tabel `business_memberships` **belum diinjeksi** ke dalam token JWT. Akibatnya, validasi untuk entitas bisnis di backend berjalan lemah/menggunakan peran `CONSUMER`.

| ROLE | CAN VIEW | CAN CREATE | CAN UPDATE | CAN DELETE | SERVER-SIDE PROTECTED? |
|---|---|---|---|---|---|
| **PLATFORM_ADMIN** | Categories, Entities | Categories | Categories, Approve Entity | Soft-Delete Category, Product, Batch | **YA** (`@PreAuthorize("hasRole('PLATFORM_ADMIN')")`) |
| **FARMER** | Products, Batches, Inv | Products, Batches, Purchases | Products, Batches | Soft-Delete Batch | **YA** (`hasAnyRole('FARMER',...)`) |
| **ENTITY_ADMIN** | - | - | - | - | **MISSING** (Belum ada integrasi ke JWT/Method Security) |
| **DISTRIBUTOR** | Inventories, Supply | Purchases, Sales, Waste | Sale Status | - | **PARTIAL** (Hanya dilindungi role Consumer/Global Auth) |
| **RETAILER** | Inventories, Supply | Purchases, Sales, Waste | Sale Status | - | **PARTIAL** (Sama seperti Distributor) |
| **STAFF** | - | - | - | - | **MISSING** |
| **CONSUMER** | Traceability | Business Request | - | - | **PARTIAL** |

---

## 4. PLATFORM ADMIN

- **Approve/reject Business Entity**: IMPLEMENTED (Hanya approve, reject belum ada endpoint khusus).
- **Melihat Business Entity**: IMPLEMENTED.
- **Mengelola/Melihat user**: **MISSING** (Hanya ada UI placeholder di frontend, API di backend `auth-service` belum dibuat).
- **Privilege Escalation Check**: 
  - Admin *tidak dapat* membuat Batch (Controller `BatchController` mengunci khusus `hasRole('FARMER')`).
  - Namun, karena kurangnya pengecekan kepemilikan (*ownership check*) di `ProductService`, secara teknis Admin yang tahu UUID produk bisa mengedit data produk petani.

---

## 5. BUSINESS ENTITY

- **Pembuat**: Siapapun yang login (Consumer/Farmer) via `BusinessEntityController.createRequest`.
- **Approval**: Khusus `PLATFORM_ADMIN`.
- **Membership Management**: **MISSING**. Pembuat otomatis menjadi `ENTITY_ADMIN`, tapi fitur menambah member lain belum diimplementasikan di API.
- **Wajib di Business Entity (Dist/Retail)**: Ya, konsep tabel memaksa ini. Tapi di `SaleService.java`, validasi hanya mengecek eksistensi `buyerEntityId`, tidak mengecek secara teknis apakah *Business Type*-nya benar-benar RETAILER/DISTRIBUTOR.
- **Transaksi sebelum Approved**: **TERLINDUNGI**. Di `PurchaseService.java`, ketika transaksi selesai, sistem mencari `InventoryAccountRef`. Akun ini baru dibuat saat Admin melakukan `approveEntity`. Jika belum disetujui, transaksi melempar `BadRequestException`.

---

## 6. FARMER

- **Profile**: PARTIAL (Hanya endpoint `/api/auth/me`).
- **Product & Batch**: IMPLEMENTED (Bisa create, read, update, soft-delete).
- **Purchase Supply**: IMPLEMENTED (Menerima purchase dari distributor).
- **Waste**: IMPLEMENTED.
- **ISOLASI DATA (IDOR Check)**: **CRITICAL FLAW**. Di `BatchService.updateBatch()`, metode mengambil batch berdasarkan ID dan menyimpannya tanpa mengecek apakah `batch.getFarmerId()` sama dengan `actorId` (User JWT). Petani A secara teoritis bisa mengedit/menghapus Batch milik Petani B jika tahu UUID-nya.

---

## 7. DISTRIBUTOR & 8. RETAILER

- **Membership & Inventory**: IMPLEMENTED (Gudang terpisah berdasarkan ID Entity).
- **Purchase & Sale**: IMPLEMENTED. Stok dipotong dan ditambah otomatis.
- **Price Capture**: IMPLEMENTED (Harga direkam per transaksi di `purchase_items` dan `sale_items`).
- **Validasi Flow B2B**: **CRITICAL FLAW**. `SaleService.java` tidak mengecek apakah penjual memiliki tipe `DISTRIBUTOR` dan pembeli bertipe `RETAILER`. Sistem hanya menerima UUID asal itu valid di database.

---

## 9. CONSUMER

- **Product Catalog & Detail**: MISSING (Hanya tersedia UI B2B di `Products.tsx`).
- **Order (B2C)**: MISSING (Tidak ada UI E-Commerce untuk Consumer/Cart).
- **Traceability**: IMPLEMENTED. Berjalan publik (tanpa token) via `GET /api/traceability/batches/code/{batchCode}`.

---

## 10. PRODUCT DAN BATCH

- **Pembuat Product**: Platform Admin & Farmer.
- **Soft-Delete**: IMPLEMENTED (`setDeletedAt(OffsetDateTime.now())`).
- **Initial Quantity Berubah**: Di `BatchService.java`, `batch.setInitialQuantity()` masih dieksekusi saat update. Ini melanggar aturan dokumen (*"initial_quantity never changes after creation"*).
- **Expired Batch**: Belum ada validasi di `SaleService.java` yang memblokir penjualan batch berstatus `EXPIRED`.

---

## 11. INVENTORY

- **Negative Stock Prevention**: IMPLEMENTED. `InventoryService.java` mengecek `if (available.compareTo(quantity) < 0) throw BadRequestException`.
- **Inventory Movement**: IMPLEMENTED.
- **Immutable Movement**: IMPLEMENTED (Di database `ciclovela_db.sql` terdapat trigger `prevent_inventory_movement_modification()`).
- **Waste & Transaksi Effect**: IMPLEMENTED (Memanggil metode `adjustInventory()` secara *transactional*).

---

## 12. SUPPLY CHAIN

- **Flow Enforcement**: **MISSING**. Sistem *TIDAK* secara eksplisit memblokir Farmer -> Retailer atau Distributor -> Consumer melalui layer Service Backend. Controller `PurchaseController` dan `SaleController` hanya memproses UUID yang dilempar dari Frontend. UI diarahkan, namun API tidak terkunci rapat untuk bisnis rules ini.

---

## 13. WASTE

- **Recording & Inventory Effect**: IMPLEMENTED. Memotong stok dan mencatat movement `WASTE_OUT`.
- **Reason, Actor, Timestamp**: IMPLEMENTED.
- **Initial Quantity tidak berubah**: IMPLEMENTED (Waste hanya memodifikasi tabel `inventories`, bukan `batches`).

---

## 14. TRACEABILITY

- **Status**: IMPLEMENTED.
- **Realita vs Mock**: **REAL DATA**. `TraceabilityService.java` melakukan query langsung ke view `v_product_traceability` dan menarik riwayat asli dari tabel `inventory_movements` yang diurutkan secara kronologis. Tampilan di React murni merender balikan data ini secara visual.

---

## 15. SEARCH / FILTER / SORT / PAGINATION

| Entity | Search | Filter | Sort | Pagination | Status |
|---|---|---|---|---|---|
| BusinessEntity | YES | YES | NO | YES | IMPLEMENTED |
| Product | YES | YES | NO | YES | IMPLEMENTED |
| Batch | YES | YES | NO | YES | IMPLEMENTED |
| Inventory | NO | YES | NO | YES | PARTIAL |
| Purchase/Sale | NO | YES | NO | YES | PARTIAL |

*Note: Sorting dinonaktifkan di UI akibat bug array empty string `[]` dari Springdoc Swagger pada `Pageable` param.*

---

## 16. UPLOAD

- **Storage**: Lokal (`/uploads` directory).
- **Validation**: IMPLEMENTED. `FileStorageService.java` menolak file > 5MB dan hanya mengizinkan `image/*` dan `application/pdf`. Path Traversal protection diaktifkan.
- **Endpoint**: `/api/attachments/upload` dan `/api/attachments/download/{fileName}` (Public).

---

## 17. ERROR HANDLING

- **GlobalExceptionHandler**: Tersedia di semua microservices. Menangani `422`, `400`, `404`, `401`, `403`, dan `500`.
- **Frontend Fallback**: Axios interceptor global terpasang. Terdapat halaman `/404` dan `/403`.

---

## 18. API LIST

| METHOD | ENDPOINT | SERVICE | STATUS |
|---|---|---|---|
| POST | `/api/auth/register` | auth-service | IMPLEMENTED |
| POST | `/api/auth/login` | auth-service | IMPLEMENTED |
| POST | `/api/auth/forgot-password` | auth-service | IMPLEMENTED |
| GET | `/api/products` | catalog-service | IMPLEMENTED |
| POST | `/api/batches` | catalog-service | IMPLEMENTED |
| POST | `/api/business-entities/requests`| inventory-service | IMPLEMENTED |
| POST | `/api/business-entities/{id}/approve` | inventory-service | IMPLEMENTED |
| POST | `/api/waste-records` | inventory-service | IMPLEMENTED |
| PATCH| `/api/purchases/{id}/status` | order-service | IMPLEMENTED |
| GET | `/api/traceability/batches/code/{code}` | traceability-service| IMPLEMENTED |

---

## 19. FRONTEND ROUTES

- **Public**: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/` (Landing Page), `/traceability`.
- **Platform Admin**: `/admin/entities`, `/admin/categories`. (Dilindungi komponen `<RoleRoute allowedRoles={['PLATFORM_ADMIN']} />`).
- **Farmer / Consumer**: `/dashboard`, `/products`, `/batches`, `/inventories`, `/business`, `/transactions/purchases`, `/transactions/sales`, `/waste`. (Dilindungi `<PrivateRoute />`).

---

## 20. RESPONSIVE DESIGN

- **Secara Umum**: Menggunakan Tailwind CSS (`flex-col sm:flex-row`, dsb).
- **Potensi Masalah**: 
  - **Sidebar.tsx**: Disembunyikan (fixed) di layar kecil. Namun tombol *hamburger menu* di `Header.tsx` **BELUM** disambungkan fungsinya untuk men-toggle Sidebar di versi Mobile. Ini menyebabkan user di HP tidak bisa membuka menu kiri.

---

## 21. DASHBOARD

- **Status API**: **MOCK / STATIC DATA**.
- **File**: `Dashboard.tsx` berisi *hardcoded array* `const stats = [...]` dan `const chartData = [...]`.
- **Visual**: Menampilkan Recharts (Area/Bar) dan Warning Card, namun angkanya statis. Belum ada API agregasi untuk ini di backend.

---

## 22. DATABASE

- **16 Tabel Utama** lengkap dengan relationship UUID.
- Semua tabel utama memiliki `created_at` dan `updated_at` yang diatur otomatis oleh trigger PL/pgSQL.
- *Soft-delete constraint* aktif pada kueri JPA.
- `inventory_movements` bersifat immutable (Trigger PL/pgSQL aktif mencegah modifikasi/hapus).

---

## 23. SEED DATA

- **Status**: **IMPLEMENTED**.
- Menyuntikkan 44 User, 20 Business Entities, 20 Products, 20 Batches, 40 Inventory Records, 20 Purchases, 20 Sales. Total > 200 baris. Flow terhubung secara logis dan realistis.

---

## 24. REQUIREMENT COMPLIANCE

| REQUIREMENT | STATUS | EVIDENCE / FILE | PRIORITY |
|---|---|---|---|
| Authentication Flow | PASS | `AuthService.java`, `Login.tsx` | P0 |
| Platform Admin RBAC | PARTIAL | `SecurityConfig.java`. Filter ada, tapi CRUD User belum ada. | P0 |
| Entity Approval | PASS | `BusinessEntityService.java` | P0 |
| Product & Batch CRUD | PASS | `ProductService.java`, `BatchService.java` | P0 |
| Immutable Inventory | PASS | `ciclovela_db.sql` triggers | P0 |
| Purchase/Sale Flow | PASS | `PurchaseService.java`, `SaleService.java` | P0 |
| Waste Feature | PASS | `InventoryService.recordWaste` | P0 |
| Traceability | PASS | `TraceabilityService.java` (Real Data) | P0 |
| Global Error Handling | PASS | `GlobalExceptionHandler.java` | P0 |
| Dashboard Data | **FAIL** | `Dashboard.tsx` (Data masih statis) | P1 |

---

## 25. CRITICAL FINDINGS

**CRITICAL (Wajib Diperbaiki Sebelum Produksi):**
1. **Insecure Direct Object Reference (IDOR)**: Petani dapat mengedit/menghapus *Batch* milik petani lain karena `BatchService` tidak mencocokkan `farmerId` dengan UUID milik pengakses (Token JWT).
2. **Missing Business Flow Validation**: `PurchaseService` dan `SaleService` tidak memverifikasi apakah entitas yang disisipkan di *payload* JSON memang bertipe DISTRIBUTOR atau RETAILER.

**HIGH:**
3. **Pemisahan Role Entitas**: Peran `DISTRIBUTOR` dan `RETAILER` di `business_memberships` tidak dimasukkan ke dalam token JWT.
4. **Dashboard Statis**: Data di halaman awal masih *hardcoded*.

**MEDIUM:**
5. **Initial Quantity Update**: Form Edit Batch masih bisa mengubah `initialQuantity` setelah diciptakan.
6. **Mobile Sidebar Bug**: Tombol hamburger di `Header.tsx` belum berfungsi di layar ponsel.

---

## 26. FINAL SUMMARY

**Completion Rate:**
- **P0 Completed**: 18/20
- **P0 Partial**: 2 (Manajemen Pengguna Admin, Flow Supply Chain Strict Validation)
- **P0 Missing**: 0
- **P1 Completed**: 2/7 (Email SMTP, Form Upload UI. Dashboard Charts masih statis)

**10 Prioritas Perbaikan Berikutnya:**
1. Tambahkan pengecekan validasi pemilik (Ownership IDOR Check) di `BatchService` dan `ProductService`.
2. Ubah `JwtAuthenticationFilter` agar memuat Role dari `business_memberships`.
3. Buat API agregasi di backend untuk menyuplai data riil ke `Dashboard.tsx`.
4. Tambahkan validasi penolakan di `PurchaseService` jika pembeli bukan DISTRIBUTOR.
5. Sembunyikan field `initialQuantity` di Frontend saat melakukan *Update Batch*.
6. Buat Endpoint CRUD User untuk Administrator (`UserController`).
7. Fungsikan tombol Menu/Hamburger Mobile di `Header.tsx`.
8. Buat API pengelolaan anggota dalam Business Entity.
9. Pasang mekanisme blokir transaksi (Sale) jika `Batch` terkait berstatus `EXPIRED`.
10. Sempurnakan tampilan antarmuka e-commerce publik untuk Konsumen Biasa (B2C Order).
