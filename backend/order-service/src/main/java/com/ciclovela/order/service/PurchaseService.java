package com.ciclovela.order.service;

import com.ciclovela.order.dto.request.OrderItemRequest;
import com.ciclovela.order.dto.request.PurchaseRequest;
import com.ciclovela.order.dto.response.PurchaseResponse;
import com.ciclovela.order.entity.*;
import com.ciclovela.order.enums.MovementType;
import com.ciclovela.order.enums.TransactionStatus;
import com.ciclovela.order.exception.BadRequestException;
import com.ciclovela.order.exception.ResourceNotFoundException;
import com.ciclovela.order.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final InventoryRefRepository inventoryRefRepository;
    private final InventoryAccountRefRepository accountRefRepository;
    private final InventoryMovementRefRepository movementRefRepository;
    private final BusinessEntityRefRepository businessEntityRefRepository;
    private final BusinessMembershipRefRepository businessMembershipRefRepository;
    private final UserRefRepository userRefRepository;
    private final JdbcTemplate jdbcTemplate;

    private void validateMembership(UUID userId, UUID entityId) {
        BusinessMembershipRef membership = businessMembershipRefRepository.findByUserIdAndBusinessEntityIdAndStatus(userId, entityId, "ACTIVE")
                .orElseThrow(() -> new com.ciclovela.order.exception.AccessDeniedException("Anda bukan anggota aktif dari entitas bisnis ini."));
        
        if ("STAFF".equals(membership.getRole())) {
            throw new com.ciclovela.order.exception.AccessDeniedException("Staff tidak memiliki wewenang untuk transaksi supply chain.");
        }
    }

    @Transactional(readOnly = true)
    public Page<PurchaseResponse> getAllPurchases(String search, UUID buyerEntityId, UUID sellerFarmerId, TransactionStatus status, java.time.OffsetDateTime startDate, java.time.OffsetDateTime endDate, UUID actorId, Pageable pageable) {
        java.util.List<UUID> allowedEntities = businessMembershipRefRepository.findAll().stream()
                .filter(m -> m.getUserId().equals(actorId) && "ACTIVE".equals(m.getStatus()))
                .map(BusinessMembershipRef::getBusinessEntityId)
                .toList();

        if (allowedEntities.isEmpty()) {
            allowedEntities = java.util.List.of(UUID.randomUUID());
        }

        boolean searchFlag = search != null && !search.trim().isEmpty();
        String safeSearch = search == null ? "" : search;
        boolean startFlag = startDate != null;
        boolean endFlag = endDate != null;
        java.time.OffsetDateTime safeStart = startDate != null ? startDate : java.time.OffsetDateTime.parse("1970-01-01T00:00:00Z");
        java.time.OffsetDateTime safeEnd = endDate != null ? endDate : java.time.OffsetDateTime.parse("9999-12-31T23:59:59Z");
        return purchaseRepository.findAllSecured(safeSearch, searchFlag, buyerEntityId, sellerFarmerId, status, safeStart, safeEnd, startFlag, endFlag, actorId, allowedEntities, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PurchaseResponse getPurchase(UUID id, UUID actorId) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pembelian tidak ditemukan"));
        
        boolean isSeller = purchase.getSellerFarmerId().equals(actorId);
        boolean isBuyerMember = businessMembershipRefRepository.findByUserIdAndBusinessEntityIdAndStatus(actorId, purchase.getBuyerEntityId(), "ACTIVE").isPresent();
        
        if (!isSeller && !isBuyerMember) {
            throw new com.ciclovela.order.exception.AccessDeniedException("Anda tidak berhak melihat transaksi ini.");
        }

        return toResponse(purchase);
    }

    @Transactional
    public PurchaseResponse createPurchase(PurchaseRequest request, UUID actorId) {
        validateMembership(actorId, request.getBuyerEntityId());

        UserRef seller = userRefRepository.findById(request.getSellerFarmerId())
                .orElseThrow(() -> new ResourceNotFoundException("Petani penjual tidak ditemukan"));
        if (!"FARMER".equals(seller.getRole())) {
            throw new BadRequestException("Penjual pada transaksi Purchase harus merupakan seorang FARMER.");
        }

        BusinessEntityRef entity = businessEntityRefRepository.findById(request.getBuyerEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Entitas pembeli tidak ditemukan"));
        
        if (!"APPROVED".equals(entity.getVerificationStatus()) || !"ACTIVE".equals(entity.getStatus())) {
            throw new BadRequestException("Entitas pembeli belum disetujui (Approved) atau tidak berstatus Active.");
        }
        
        if (!"DISTRIBUTOR".equals(entity.getBusinessType())) {
            throw new BadRequestException("Hanya entitas bertipe DISTRIBUTOR yang dapat melakukan Purchase langsung dari Petani.");
        }

        String code = "PUR-" + System.currentTimeMillis();

        Purchase purchase = Purchase.builder()
                .transactionCode(code)
                .buyerEntityId(request.getBuyerEntityId())
                .sellerFarmerId(request.getSellerFarmerId())
                .status(TransactionStatus.PENDING)
                .notes(request.getNotes())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.getItems()) {
            BigDecimal subtotal = itemReq.getQuantity().multiply(itemReq.getUnitPrice());
            PurchaseItem item = PurchaseItem.builder()
                    .purchase(purchase)
                    .batchId(itemReq.getBatchId())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .subtotal(subtotal)
                    .build();
            purchase.getItems().add(item);
            total = total.add(subtotal);
        }
        purchase.setTotalAmount(total);

        return toResponse(purchaseRepository.save(purchase));
    }

    @Transactional
    public PurchaseResponse updateStatus(UUID id, TransactionStatus newStatus, UUID actorId) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pembelian tidak ditemukan"));

        TransactionStatus current = purchase.getStatus();
        validateTransition(current, newStatus);

        if (newStatus == TransactionStatus.CONFIRMED || (current == TransactionStatus.PENDING && newStatus == TransactionStatus.CANCELLED)) {
            // Yang boleh confirm atau tolak di awal adalah FARMER (Penjual)
            if (!purchase.getSellerFarmerId().equals(actorId)) {
                throw new com.ciclovela.order.exception.AccessDeniedException("Hanya petani penjual yang dapat mengkonfirmasi transaksi ini.");
            }
        } else if (newStatus == TransactionStatus.COMPLETED) {
            // Yang boleh komplit adalah Pembeli (Distributor)
            validateMembership(actorId, purchase.getBuyerEntityId());
            completePurchase(purchase, actorId);
        }

        purchase.setStatus(newStatus);
        return toResponse(purchaseRepository.save(purchase));
    }

    private void completePurchase(Purchase purchase, UUID actorId) {
        InventoryAccountRef buyerAccount = accountRefRepository.findByOwnerBusinessEntityId(purchase.getBuyerEntityId())
                .orElseThrow(() -> new BadRequestException("Akun inventory pembeli tidak ditemukan. Pastikan entitas bisnis sudah disetujui"));

        for (PurchaseItem item : purchase.getItems()) {
            InventoryRef inventory = inventoryRefRepository.findByInventoryAccountIdAndBatchId(
                    buyerAccount.getId(), item.getBatchId()
            ).orElseGet(() -> {
                InventoryRef newInv = InventoryRef.builder()
                        .inventoryAccountId(buyerAccount.getId())
                        .batchId(item.getBatchId())
                        .quantity(BigDecimal.ZERO)
                        .reservedQuantity(BigDecimal.ZERO)
                        .build();
                return inventoryRefRepository.save(newInv);
            });

            inventory.setQuantity(inventory.getQuantity().add(item.getQuantity()));
            inventoryRefRepository.save(inventory);

            InventoryMovementRef movement = InventoryMovementRef.builder()
                    .inventoryId(inventory.getId())
                    .movementType(MovementType.PURCHASE_IN)
                    .quantity(item.getQuantity())
                    .referenceType("PURCHASE")
                    .referenceId(purchase.getId())
                    .description("Pembelian dari farmer: " + purchase.getTransactionCode())
                    .createdBy(actorId != null ? actorId : purchase.getBuyerEntityId())
                    .build();
            movementRefRepository.save(movement);
        }
    }

    private void validateTransition(TransactionStatus from, TransactionStatus to) {
        boolean valid = switch (from) {
            case PENDING -> to == TransactionStatus.CONFIRMED || to == TransactionStatus.CANCELLED;
            case CONFIRMED -> to == TransactionStatus.COMPLETED || to == TransactionStatus.CANCELLED;
            default -> false;
        };
        if (!valid) {
            throw new BadRequestException("Tidak dapat mengubah status dari " + from + " ke " + to);
        }
    }

    private PurchaseResponse toResponse(Purchase p) {
        return PurchaseResponse.builder()
                .id(p.getId())
                .transactionCode(p.getTransactionCode())
                .buyerEntityId(p.getBuyerEntityId())
                .sellerFarmerId(p.getSellerFarmerId())
                .transactionDate(p.getTransactionDate())
                .status(p.getStatus().name())
                .totalAmount(p.getTotalAmount())
                .notes(p.getNotes())
                .items(p.getItems().stream()
                        .map(i -> {
                            String bCode = "";
                            String pName = "";
                            try {
                                Map<String, Object> batchInfo = jdbcTemplate.queryForMap(
                                    "SELECT b.batch_code, pr.name FROM batches b JOIN products pr ON b.product_id = pr.id WHERE b.id = CAST(? AS UUID)", 
                                    i.getBatchId().toString()
                                );
                                bCode = String.valueOf(batchInfo.get("batch_code"));
                                pName = String.valueOf(batchInfo.get("name"));
                            } catch (Exception e) {}
                            
                            return PurchaseResponse.ItemResponse.builder()
                                .id(i.getId())
                                .batchId(i.getBatchId())
                                .batchCode(bCode)
                                .productName(pName)
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .subtotal(i.getSubtotal())
                                .build();
                        })
                        .toList())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
