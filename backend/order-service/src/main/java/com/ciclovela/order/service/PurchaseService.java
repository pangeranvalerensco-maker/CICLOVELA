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

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final InventoryRefRepository inventoryRefRepository;
    private final InventoryAccountRefRepository accountRefRepository;
    private final InventoryMovementRefRepository movementRefRepository;

    @Transactional(readOnly = true)
    public Page<PurchaseResponse> getAllPurchases(UUID buyerEntityId, UUID sellerFarmerId, TransactionStatus status, Pageable pageable) {
        return purchaseRepository.findAllWithFilters(buyerEntityId, sellerFarmerId, status, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PurchaseResponse getPurchase(UUID id) {
        return purchaseRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Pembelian tidak ditemukan"));
    }

    @Transactional
    public PurchaseResponse createPurchase(PurchaseRequest request) {
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

        if (newStatus == TransactionStatus.COMPLETED) {
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
                    .createdBy(actorId != null ? actorId : purchase.getBuyerEntityId()) // Fallback to entity ID if token is empty during manual testing
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
                        .map(i -> PurchaseResponse.ItemResponse.builder()
                                .id(i.getId())
                                .batchId(i.getBatchId())
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .subtotal(i.getSubtotal())
                                .build())
                        .toList())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
