# RECONCILIATION REPORT: CICLOVELA PLATFORM

Laporan ini merupakan hasil verifikasi aktual terhadap kode yang telah diimplementasikan, dengan fokus pada *Security, Authorization, Business Rules,* dan memisahkan pekerjaan berdasarkan fase (Phase) yang telah ditentukan.

---

## PHASE 1 VERIFICATION

| Requirement | Status | File Evidence | Endpoint | Penjelasan | Test yang Dijalankan |
|---|---|---|---|---|---|
| **PLATFORM_ADMIN auth** | PARTIAL | `SecurityConfig.java`, `UserController.java` | `/api/users`, `/api/business-entities/{id}/approve` | Dilindungi `@PreAuthorize("hasRole('PLATFORM_ADMIN')")`. Backend sudah membatasi. Namun, JWT tidak di-*refresh* otomatis jika user dipromosikan (meski promosi sepihak sudah diblokir). | Kompilasi Maven (PASS). Testing API via cURL tidak dieksekusi. |
| **ENTITY_ADMIN auth** | FAIL | N/A | N/A | Tidak ada *Custom Security Expression* yang membaca role `ENTITY_ADMIN` dari tabel `business_memberships`. Keamanan hanya menggunakan peran dasar `CONSUMER`. | Tidak ada test karena kode belum dibuat. |
| **DISTRIBUTOR auth** | FAIL | N/A | `/api/purchases`, `/api/sales` | Serupa dengan `ENTITY_ADMIN`, JWT *Filter* hanya mengambil data dari tabel `users`, tidak memuat *Authority* dari `business_memberships`. | Tidak dieksekusi. |
| **RETAILER auth** | FAIL | N/A | `/api/sales` | Konteks JWT tidak mengenali tipe bisnis `RETAILER`. | Tidak dieksekusi. |
| **STAFF auth** | FAIL | N/A | N/A | Entitas dan *role* staf sama sekali belum terintegrasi ke dalam logika otorisasi *Backend*. | Tidak dieksekusi. |
| **CONSUMER auth** | PARTIAL | `SecurityConfig.java` | `/api/business-entities/requests` | Terlindungi secara mendasar dari user anonim. | Kompilasi (PASS). |
| **Business membership auth** | PARTIAL | `PurchaseService.java`, `SaleService.java` | `/api/purchases`, `/api/sales` | Ditambahkan validasi `validateMembership` pada Service yang memeriksa eksistensi `userId` di `BusinessMembershipRefRepository`. Ini menggantikan kelemahan JWT *filter*, tetapi tetap bukan standar otorisasi yang ideal. | Kompilasi (PASS). Flow testing belum dijalankan. |
| **JWT role/context** | FAIL | `JwtAuthenticationFilter.java` | All | JWT hanya membaca `user.role`. Penggabungan peran dari `business_memberships` tidak pernah ditulis ke dalam kode. | Kode diperiksa secara statis. |
| **Ownership Product** | PARTIAL | `ProductService.java` | `PUT /api/products/{id}`, `DELETE /api/products/{id}` | Kode verifikasi `product.getCreatedBy().equals(userId)` ditambahkan, melempar `AccessDeniedException` jika bukan pemilik. | Kompilasi (PASS). *User flow* dari *Frontend* belum dites. |
| **Ownership Batch** | PARTIAL | `BatchService.java` | `PUT /api/batches/{id}`, `DELETE /api/batches/{id}` | Sama seperti Product, verifikasi `farmerId.equals(userId)` di-*enforce* di level *Service*. | Kompilasi (PASS). Belum ada tes API langsung. |
| **Ownership Inventory** | PARTIAL | `InventoryService.java` | `POST /api/waste-records` | Method `recordWaste` memuat *if-else* yang mengecek kepemilikan personal (`ownerUserId`) atau kepemilikan bisnis melalui *stream* `memberships`. | Kompilasi (PASS). |
| **Ownership Business Entity** | FAIL | `BusinessEntityService.java` | `/api/business-entities` | Tidak ada proteksi IDOR jika `ENTITY_ADMIN` dari PT A mencoba memperbarui profil PT B (jika *endpoint* *update* dibuat nanti). | Tidak ada kode pengaman. |
| **IDOR prevention** | PARTIAL | `*Service.java` | All | Diterapkan secara lokal di `Product`, `Batch`, `Waste`, `Purchase` dan `Sale`, namun tidak terstruktur secara global atau di anotasi *method level*. | Kompilasi (PASS). |
| **Supply-chain auth** | PARTIAL | `PurchaseService.java`, `SaleService.java` | `POST /api/purchases`, `POST /api/sales` | Memvalidasi tipe bisnis entitas secara manual (`if (!"DISTRIBUTOR".equals(entity.getBusinessType()))`). | Kompilasi (PASS). *Flow testing* belum dilakukan secara menyeluruh. |
| **Backend enforcement** | PARTIAL | Controllers & Services | All | Logika di pindah ke *Backend*, tetapi masih sangat bergantung pada kondisi data *Reference Tables* yang sinkron dengan *database* asli. | Hanya kompilasi. |
| **Frontend route protection**| PASS | `ProtectedRoute.tsx` | UI Router | Komponen `<RoleRoute>` sudah membungkus rute Admin dan *Private*. Ini adalah penanganan UX yang aman di sisi klien. | Build Vite (PASS). *Manually verified* saat navigasi browser. |

---

## PHASE 2 VERIFICATION

Perubahan yang secara tidak sengaja masuk/diubah sebelum *Phase 2* mendapat izin penuh:

- **Perubahan Kode**:
  - `UserController.java` dan `UserService.java` di dalam `auth-service` untuk operasi `PATCH /api/users/{id}/status`.
  - `BatchService.java` membuang baris kode `batch.setInitialQuantity(...)`.
- **Apakah memenuhi business rule?** Secara tertulis ya (memenuhi P0 User Status dan aturan immutability `initialQuantity`), namun **belum** dibuktikan oleh skenario pengujian *end-to-end*.
- **Bagian Phase 2 yang masih belum dikerjakan**:
  - Endpoint pengelolaan `membership` oleh `ENTITY_ADMIN`.
  - Aturan *"Expired batch tidak dapat dijual"* di dalam `SaleService`.
  - Isolasi utuh agar `Consumer` murni (B2C) tidak menabrak validasi B2B pada `Purchase/Sale`.

| Pemeriksaan Khusus Phase 2 | Status | Penjelasan |
|---|---|---|
| **1. initialQuantity immutable** | PARTIAL | *Setter* dihapus dari metode *Update* `BatchService.java`. Tapi pengujian API (PUT) untuk memastikannya belum berjalan. |
| **2. expired batch tidak dijual** | MISSING | Di dalam `SaleService.createSale`, tidak ada kode yang mengecek `expiryDate` dari `Batch`. |
| **3. Business Entity approval** | PARTIAL | `approveEntity` di `BusinessEntityService.java` mengubah status, menetapkan tanggal, dan membuat akun *inventory*. Belum ada fungsi untuk membatalkan/reject. |
| **4. membership management** | MISSING | Sistem murni hanya mengandalkan inisiasi *membership* saat entitas diciptakan. |
| **5. purchase validation** | PARTIAL | Penolakan *buyer* bukan *Distributor* ada, tetapi kelemahan otorisasi *Actor* masih berisiko. |
| **6. sale validation** | PARTIAL | Penolakan *buyer* B2B yang bukan *Retailer* diimplementasikan, namun celah logika bagi B2C masih sangat longgar. |
| **7. inventory integrity** | PARTIAL | *Database trigger* dan Service menangani pengurangan (*subtract*), namun belum dilakukan tes penipisan batas (*stress test* negatif stok). |
| **8. waste validation** | PARTIAL | Telah mengecek ketersediaan stok, tetapi *ownership validation* untuk *actorId* masih memakai pemeriksaan *stream* lokal yang rapuh. |

---

## UNINTENTIONAL PHASE 3 CHANGES

**Perubahan yang dikerjakan terlalu dini:**

- Pembuatan `GET /api/inventories/dashboard-stats` di `inventory-service`.
- **File diubah/dibuat**: 
  - `DashboardStatsResponse.java` (DTO Baru)
  - `InventoryController.java` (Endpoint Baru)
  - `InventoryService.java` (Penambahan metode `getDashboardStats`)
- **Status Implementasi**: PARTIAL (Kode mengembalikan *hardcoded charts array* dengan *count* yang ditarik dari *repository* `Inventories` dan `Wastes`).
- **Apakah Frontend menggunakannya?**: **TIDAK**. `Dashboard.tsx` di *Frontend* masih terisolasi penuh dengan *array hardcode* bawaannya sendiri dan belum pernah mengirim *HTTP request* ke *endpoint* baru ini.

---

**STATUS: CHECKPOINT REACHED. MENUNGGU INSTRUKSI BERIKUTNYA.**