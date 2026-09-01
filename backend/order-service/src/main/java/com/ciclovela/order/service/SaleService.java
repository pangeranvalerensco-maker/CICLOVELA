package com.ciclovela.order.service;

import com.ciclovela.order.dto.request.OrderItemRequest;
import com.ciclovela.order.dto.request.SaleRequest;
import com.ciclovela.order.dto.response.SaleResponse;
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
public class SaleService {

    private final SaleRepository saleRepository;
    private final InventoryRefRepository inventoryRefRepository;
    private final InventoryAccountRefRepository accountRefRepository;
    private final InventoryMovementRefRepository movementRefRepository;

    @Transactional(readOnly = true)
    public Page<SaleResponse> getAllSales(UUID sellerEntityId, UUID buyerEntityId, UUID buyerUserId, TransactionStatus status, Pageable pageable) {
        return saleRepository.findAllWithFilters(sellerEntityId, buyerEntityId, buyerUserId, status, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public SaleResponse getSale(UUID id) {
        return saleRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Penjualan tidak ditemukan"));
    }

    @Transactional
    public SaleResponse createSale(SaleRequest request) {
        if (request.getBuyerEntityId() == null && request.getBuyerUserId() == null) {
            throw new BadRequestException("Pembeli wajib diisi (buyerEntityId atau buyerUserId)");
        }
        if (request.getBuyerEntityId() != null && request.getBuyerUserId() != null) {
            throw new BadRequestException("Hanya boleh mengisi salah satu: buyerEntityId atau buyerUserId");
        }

        String code = "SAL-" + System.currentTimeMillis();

        Sale sale = Sale.builder()
                .transactionCode(code)
                .sellerEntityId(request.getSellerEntityId())
                .buyerEntityId(request.getBuyerEntityId())
                .buyerUserId(request.getBuyerUserId())
                .status(TransactionStatus.PENDING)
                .notes(request.getNotes())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.getItems()) {
            BigDecimal subtotal = itemReq.getQuantity().multiply(itemReq.getUnitPrice());
            SaleItem item = SaleItem.builder()
                    .sale(sale)
                    .batchId(itemReq.getBatchId())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .subtotal(subtotal)
                    .build();
            sale.getItems().add(item);
            total = total.add(subtotal);
        }
        sale.setTotalAmount(total);

        return toResponse(saleRepository.save(sale));
    }

    @Transactional
    public SaleResponse updateStatus(UUID id, TransactionStatus newStatus, UUID actorId) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Penjualan tidak ditemukan"));

        TransactionStatus current = sale.getStatus();
        validateTransition(current, newStatus);

        if (newStatus == TransactionStatus.COMPLETED) {
            completeSale(sale, actorId);
        }

        sale.setStatus(newStatus);
        return toResponse(saleRepository.save(sale));
    }

    private void completeSale(Sale sale, UUID actorId) {
        InventoryAccountRef sellerAccount = accountRefRepository.findByOwnerBusinessEntityId(sale.getSellerEntityId())
                .orElseThrow(() -> new BadRequestException("Akun inventory penjual tidak ditemukan"));

        for (SaleItem item : sale.getItems()) {
            InventoryRef inventory = inventoryRefRepository.findByInventoryAccountIdAndBatchId(
                    sellerAccount.getId(), item.getBatchId()
            ).orElseThrow(() -> new BadRequestException("Stok batch tidak ditemukan di inventory penjual"));

            BigDecimal available = inventory.getQuantity().subtract(inventory.getReservedQuantity());
            if (available.compareTo(item.getQuantity()) < 0) {
                throw new BadRequestException("Stok tidak mencukupi untuk batch " + item.getBatchId() + ". Tersedia: " + available);
            }

            inventory.setQuantity(inventory.getQuantity().subtract(item.getQuantity()));
            inventoryRefRepository.save(inventory);

            InventoryMovementRef outMovement = InventoryMovementRef.builder()
                    .inventoryId(inventory.getId())
                    .movementType(MovementType.SALE_OUT)
                    .quantity(item.getQuantity())
                    .referenceType("SALE")
                    .referenceId(sale.getId())
                    .description("Penjualan: " + sale.getTransactionCode())
                    .createdBy(actorId != null ? actorId : sale.getSellerEntityId())
                    .build();
            movementRefRepository.save(outMovement);

            // If buyer is a business entity, add to their inventory (B2B: Dist→Retail)
            if (sale.getBuyerEntityId() != null) {
                InventoryAccountRef buyerAccount = accountRefRepository.findByOwnerBusinessEntityId(sale.getBuyerEntityId())
                        .orElseThrow(() -> new BadRequestException("Akun inventory pembeli tidak ditemukan"));

                InventoryRef buyerInv = inventoryRefRepository.findByInventoryAccountIdAndBatchId(
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

                buyerInv.setQuantity(buyerInv.getQuantity().add(item.getQuantity()));
                inventoryRefRepository.save(buyerInv);

                InventoryMovementRef inMovement = InventoryMovementRef.builder()
                        .inventoryId(buyerInv.getId())
                        .movementType(MovementType.TRANSFER_IN)
                        .quantity(item.getQuantity())
                        .referenceType("SALE")
                        .referenceId(sale.getId())
                        .description("Diterima dari: " + sale.getTransactionCode())
                        .createdBy(actorId != null ? actorId : sale.getBuyerEntityId())
                        .build();
                movementRefRepository.save(inMovement);
            }
            // If buyer is a consumer (B2C), no inventory record needed for consumer
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

    private SaleResponse toResponse(Sale s) {
        return SaleResponse.builder()
                .id(s.getId())
                .transactionCode(s.getTransactionCode())
                .sellerEntityId(s.getSellerEntityId())
                .buyerEntityId(s.getBuyerEntityId())
                .buyerUserId(s.getBuyerUserId())
                .transactionDate(s.getTransactionDate())
                .status(s.getStatus().name())
                .totalAmount(s.getTotalAmount())
                .notes(s.getNotes())
                .items(s.getItems().stream()
                        .map(i -> SaleResponse.ItemResponse.builder()
                                .id(i.getId())
                                .batchId(i.getBatchId())
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .subtotal(i.getSubtotal())
                                .build())
                        .toList())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
