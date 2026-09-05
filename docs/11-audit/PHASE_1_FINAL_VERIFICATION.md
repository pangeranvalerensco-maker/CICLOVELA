# PHASE 1 FINAL VERIFICATION (REVISION 1)

Laporan ini memuat status verifikasi akhir untuk fase *Security & Authorization Remediation*. Laporan dibedakan secara tegas antara Inspeksi Kode (Static Code Analysis) dengan Pengujian Aktual di Jaringan (HTTP/E2E Testing). Kegagalan melakukan *test* akibat keterbatasan *environment* didokumentasikan sebagaimana mestinya tanpa manipulasi status.

---

## 1. STATUS KESELURUHAN & EVIDENCE

| Requirement | Static Code Status | HTTP/E2E Test Status | Final Status | Evidence File & Endpoint | Keterangan / Root Cause |
|---|---|---|---|---|---|
| **PLATFORM_ADMIN auth** | PASS | NOT VERIFIED | **PARTIAL** | `auth` / `UserController.java` (`PATCH /api/users/{id}/status`) | Secara statis: Promosi admin sepihak dicegah, endpoint dilindungi `@PreAuthorize("hasRole('PLATFORM_ADMIN')")`. E2E *Blocked* karena *timeout* jaringan. |
| **ENTITY_ADMIN auth** | PASS | NOT VERIFIED | **PARTIAL** | `inventory` / `BusinessEntityService.java` (`POST /.../members`) | Pengecekan eksplisit `m.getRole() == MembershipRole.ENTITY_ADMIN` dilakukan di *Service* spesifik terhadap `entityId` target. Tidak ada *privilege escalation* menyilang antar bisnis. E2E tidak jalan. |
| **DISTRIBUTOR auth** | PASS | NOT VERIFIED | **PARTIAL** | `order` / `PurchaseService.java` & `SaleService.java` | JWT memuat `ROLE_DISTRIBUTOR`. Validasi B2B *strict* di Service (`if (!"DISTRIBUTOR".equals(entity.getBusinessType()))`). E2E belum jalan. |
| **RETAILER auth** | PASS | NOT VERIFIED | **PARTIAL** | `order` / `SaleService.java` (`POST /api/sales`) | Validasi pembeli B2B harus `RETAILER` dan penjual B2C harus `RETAILER` sudah ada di kode. |
| **STAFF auth** | PASS | NOT VERIFIED | **PARTIAL** | `order` / `PurchaseService.java` & `SaleService.java` | Di-hardcode pengecualian `if ("STAFF".equals(membership.getRole())) throw AccessDeniedException`. E2E *Blocked*. |
| **Business membership auth** | PASS | NOT VERIFIED | **PARTIAL** | `inventory`, `order` / `*Service.java` | *Validation Helper* (`validateMembership`) selalu memanggil database referensi untuk membuktikan `actorId` adalah anggota `ACTIVE` dari `entityId` yang dituju. |
| **JWT role/context** | PASS | NOT VERIFIED | **PARTIAL** | `auth` / `JwtUtil.java`, `AuthService.java`, `JwtAuthenticationFilter.java` | *AuthService* menarik status `ACTIVE` dari keanggotaan dan menggabungkannya ke JWT `generateToken()`. *Filter* melakukan `.split(",")` dan memasukkan seluruh klaim sebagai `GrantedAuthority`. |
| **Ownership Product** | PASS | NOT VERIFIED | **PARTIAL** | `catalog` / `ProductService.java` (`PUT /api/products/{id}`, `DELETE`) | Validasi `!product.getCreatedBy().equals(userId)` menjamin hanya pembuat (atau admin jika dilewatkan dengan bypass) yang bisa memodifikasi. |
| **Ownership Batch** | PASS | NOT VERIFIED | **PARTIAL** | `catalog` / `BatchService.java` (`PUT /api/batches/{id}`, `DELETE`) | Validasi `!batch.getFarmerId().equals(farmerId)` memastikan Petani A tak bisa menyentuh Batch Petani B. |
| **Ownership Inventory (IDOR READ)**| PASS | NOT VERIFIED | **PARTIAL** | `inventory` / `InventoryRepository.java`, `InventoryService.java` (`GET /api/inventories`) | Kueri JPQL `findAllSecured` telah diganti, me-mutlak-kan klausa `ownerUserId = :actorId OR ownerBusinessEntity.id IN :allowedEntityIds`. Data tak dapat dicuri pihak luar meski tanpa argumen filter Frontend. |
| **Supply-chain auth** | PASS | NOT VERIFIED | **PARTIAL** | `order` / `PurchaseService.java`, `SaleService.java` | Logika kontrol berada di tingkat `Service`, bukan lagi mengandalkan penyembunyian antarmuka UI di sisi klien. |
| **Backend enforcement** | PASS | NOT VERIFIED | **PARTIAL** | Seluruh Lapis *Services* | Kepemilikan dan Keanggotaan tidak lagi bersumber dari *payload* bodong yang dapat dimanipulasi klien, melainkan murni bersandar pada validasi silang dengan status basis data. |

---

## 2. ENDPOINT MATRIX TERBARU (BERBASIS KODE AKTUAL)

Berikut daftar lengkap keamanan pada operasi `READ` yang rawan IDOR:

| Service | Endpoint | Controller Authorization | Service Authorization | Repository/Data Filter | Owner Definition | Static Status | HTTP/E2E Status | Final Status |
|---|---|---|---|---|---|---|---|---|
| `inventory` | `GET /api/inventories` | `hasAnyRole(FARMER, DISTRIBUTOR, RETAILER, ENTITY_ADMIN)` | Merekap daftar Entitas milik `actorId` | `findAllSecured` memaksa parameter `actorId` dan `allowedEntityIds`. | `InventoryAccount.ownerUserId` / `ownerBusinessEntity.id` | PASS | BLOCKED | PARTIAL |
| `inventory` | `GET /api/inventories/{id}` | Sama seperti di atas | `validateInventoryOwnership()` | Mencari by ID (standar) | Menolak akses kecuali merupakan `ownerUserId` atau anggota `ACTIVE` dari `ownerBusinessEntity`. | PASS | BLOCKED | PARTIAL |
| `order` | `GET /api/purchases` | Tidak ada | Merekap daftar Entitas | `findAllSecured` memaksa parameter `actorId` / `allowedEntityIds`. | `sellerFarmerId` atau `buyerEntityId` | PASS | BLOCKED | PARTIAL |
| `order` | `GET /api/sales` | `hasAnyRole(DISTRIBUTOR, RETAILER, ENTITY_ADMIN, CONSUMER)` | Merekap daftar Entitas | `findAllSecured` memaksa `actorId` / `allowedEntityIds`. | `sellerEntityId`, `buyerEntityId`, atau `buyerUserId` | PASS | BLOCKED | PARTIAL |

*Note: HTTP/E2E Status pada seluruh endpoint tersebut bernilai `BLOCKED` akibat keterbatasan lingkungan PowerShell yang mengalami hang/timeout saat menembak URL lokal.*

---

## 3. AUDIT KESELARASAN IMPLEMENTASI KODE KHUSUS

### A. JWT & Business Membership Injection Flow (End-to-end trace)
Berdasarkan `auth-service` dan *Gateway filter*:
1. **Login/Register:**
   * `AuthService.java` memanggil `getEntityRoles(user.getId())`.
2. **Kueri Membership:**
   * `AuthService.java` mengeksekusi `membershipRefRepository.findByUserIdAndStatus(userId, "ACTIVE")`.
   * Hanya baris yang berstatus `ACTIVE` yang diambil nilai `.getRole()`-nya (contoh: `DISTRIBUTOR`).
3. **Penyisipan Klaim JWT:**
   * Kumpulan string dikirim ke `jwtUtil.generateToken(..., entityRoles)`.
   * Digabung dengan koma: `role + "," + String.join(",", entityRoles)`.
4. **Parsing Filter di Tiap Service:**
   * `JwtAuthenticationFilter.java` memanggil `Arrays.stream(role.split(",")).map(r -> new SimpleGrantedAuthority("ROLE_" + r.trim()))`.
   * Ini secara statis membuktikan validitas arsitektur injeksi peran ganda.

### B. ENTITY_ADMIN Authorization
1. Endpoint: `POST /api/business-entities/{id}/members` (`BusinessEntityController.java`).
2. Controller Auth: `@PreAuthorize("hasRole('ENTITY_ADMIN')")`.
3. Service Method: `addMember(...)`.
4. Validasi Detail: Mengeksekusi `membershipRepository.findByUserIdAndBusinessEntityId(actorId, entityId)`. Memeriksa apakah `m.getRole() == MembershipRole.ENTITY_ADMIN` DAN `m.getStatus() == "ACTIVE"`.
5. Hasil: Aktor tak bisa menjadi `ENTITY_ADMIN` global yang mengelola bisnis orang lain.

---
*Laporan selesai.*