# PHASE 2 VERIFICATION (Core Business Rules)

## 1. Expired-batch block
- Status: PASS (static + compile)
- Evidence: `order-service/.../service/SaleService.java` (~line 128-133)
  - `batchRefRepository.findById(itemReq.getBatchId())`
  - Tolak jika `status == EXPIRED` atau `expiryDate < LocalDate.now()` → `BadRequestException`
- Test: compile order-service OK

## 2. initialQuantity immutable
- Status: PASS (static + compile)
- Evidence: `catalog-service/.../service/BatchService.java`
  - `initialQuantity` hanya di builder saat create (line 61)
  - Tidak ada `setInitialQuantity` di update (komentar line 97)
- Test: compile catalog-service OK

## 3. Purchase/Sale validation
- Status: PASS (static + compile)
- Evidence: `order-service/.../service/PurchaseService.java`
  - Seller harus `FARMER` (UserRef check)
  - Buyer harus `DISTRIBUTOR` + `APPROVED` + `ACTIVE`
  - Actor harus member `ACTIVE` non-`STAFF` (validateMembership)
- Evidence: `SaleService.java` B2B buyer harus `RETAILER`, B2C seller harus `RETAILER`

## 4. Inventory integrity
- Status: PASS (static + compile)
- Evidence: `inventory-service/.../service/InventoryService.java` (~line 97,119-121)
  - Quantity harus > 0
  - `available = quantity - reservedQuantity`; tolak jika `available < quantity`

## Catatan
- HTTP/E2E belum dijalankan di sesi ini (STOP sesuai checkpoint).
- Tidak ada commit/push. Tidak lanjut Phase 3.
