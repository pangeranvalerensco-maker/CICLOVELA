package com.ciclovela.inventory.service;

import com.ciclovela.inventory.dto.request.WasteRequest;
import com.ciclovela.inventory.dto.response.DashboardStatsResponse;
import com.ciclovela.inventory.dto.response.InventoryResponse;
import com.ciclovela.inventory.entity.Inventory;
import com.ciclovela.inventory.entity.InventoryAccount;
import com.ciclovela.inventory.entity.InventoryMovement;
import com.ciclovela.inventory.entity.Waste;
import com.ciclovela.inventory.enums.MovementType;
import com.ciclovela.inventory.exception.BadRequestException;
import com.ciclovela.inventory.exception.ResourceNotFoundException;
import com.ciclovela.inventory.repository.InventoryAccountRepository;
import com.ciclovela.inventory.repository.InventoryMovementRepository;
import com.ciclovela.inventory.repository.InventoryRepository;
import com.ciclovela.inventory.repository.WasteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryAccountRepository accountRepository;
    private final InventoryMovementRepository movementRepository;
    private final WasteRepository wasteRepository;

    @Transactional(readOnly = true)
    public Page<InventoryResponse> getInventories(UUID accountId, UUID batchId, Pageable pageable) {
        return inventoryRepository.findAllWithFilters(accountId, batchId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryDetail(UUID id) {
        return inventoryRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory tidak ditemukan"));
    }

    /**
     * Initializes personal farmer inventory account if not exists
     */
    @Transactional
    public InventoryAccount getOrCreateFarmerAccount(UUID farmerId) {
        return accountRepository.findByOwnerUserId(farmerId)
                .orElseGet(() -> accountRepository.save(
                        InventoryAccount.builder().ownerUserId(farmerId).build()
                ));
    }

    /**
     * Core inventory adjustment. Modifies inventory and creates movement record.
     */
    @Transactional
    public void adjustInventory(UUID accountId, UUID batchId, BigDecimal quantity, 
                                MovementType type, String refType, UUID refId, 
                                String description, UUID actorId) {
        
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Kuantitas pergerakan harus lebih dari 0");
        }

        Inventory inventory = inventoryRepository.findByInventoryAccountIdAndBatchId(accountId, batchId)
                .orElseGet(() -> {
                    // Create if not exist and it's an INBOUND movement
                    if (isInbound(type)) {
                        InventoryAccount account = accountRepository.findById(accountId)
                                .orElseThrow(() -> new ResourceNotFoundException("Account tidak ditemukan"));
                        return inventoryRepository.save(Inventory.builder()
                                .inventoryAccount(account)
                                .batchId(batchId)
                                .quantity(BigDecimal.ZERO)
                                .reservedQuantity(BigDecimal.ZERO)
                                .build());
                    }
                    throw new ResourceNotFoundException("Inventory tidak ditemukan untuk batch ini");
                });

        if (isInbound(type)) {
            inventory.setQuantity(inventory.getQuantity().add(quantity));
        } else {
            BigDecimal available = inventory.getQuantity().subtract(inventory.getReservedQuantity());
            if (available.compareTo(quantity) < 0) {
                throw new BadRequestException("Inventory tidak mencukupi. Tersedia: " + available);
            }
            inventory.setQuantity(inventory.getQuantity().subtract(quantity));
        }

        inventory = inventoryRepository.save(inventory);

        // Immutable movement record
        InventoryMovement movement = InventoryMovement.builder()
                .inventory(inventory)
                .movementType(type)
                .quantity(quantity)
                .referenceType(refType)
                .referenceId(refId)
                .description(description)
                .createdBy(actorId)
                .build();
        
        movementRepository.save(movement);
    }

    @Transactional
    public void recordWaste(WasteRequest request, UUID actorId) {
        Inventory inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory tidak ditemukan"));

        // Validasi Pemilik Inventory
        InventoryAccount account = inventory.getInventoryAccount();
        if (account.getOwnerUserId() != null) {
            // Personal inventory (Farmer)
            if (!account.getOwnerUserId().equals(actorId)) {
                throw new com.ciclovela.inventory.exception.AccessDeniedException("Anda tidak berhak mencatat limbah di inventory ini.");
            }
        } else if (account.getOwnerBusinessEntity() != null) {
            // Business inventory (Distributor / Retailer)
            boolean isMember = account.getOwnerBusinessEntity().getMemberships().stream()
                    .anyMatch(m -> m.getUserId().equals(actorId) && "ACTIVE".equals(m.getStatus().name()));
            if (!isMember) {
                throw new com.ciclovela.inventory.exception.AccessDeniedException("Anda bukan anggota aktif dari bisnis ini.");
            }
        }

        // Waste specific record
        Waste waste = Waste.builder()
                .batchId(inventory.getBatchId())
                .inventory(inventory)
                .quantity(request.getQuantity())
                .reason(request.getReason())
                .notes(request.getNotes())
                .recordedBy(actorId)
                .build();
        
        waste = wasteRepository.save(waste);

        // Inventory adjustment
        adjustInventory(
                inventory.getInventoryAccount().getId(),
                inventory.getBatchId(),
                request.getQuantity(),
                MovementType.WASTE_OUT,
                "WASTE",
                waste.getId(),
                "Waste recorded: " + request.getReason(),
                actorId
        );
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(UUID userId) {
        // Implementasi sederhana untuk MVP:
        // Kami mengabaikan agregasi kompleks agar layanan tidak terbebani query pelik di PostgreSQL.
        // Data ini dikembalikan semi-statis yang dikombinasikan dengan count riil
        long totalInventory = inventoryRepository.count();
        long totalWaste = wasteRepository.count();

        return DashboardStatsResponse.builder()
                .totalInventoryQuantity(totalInventory * 150) // dummy simulation
                .inboundTransactions(45)
                .outboundTransactions(30)
                .totalWasteRecorded(totalWaste * 5)
                .inventoryTrend(java.util.List.of(
                        DashboardStatsResponse.ChartData.builder().name("Sen").masuk(400).keluar(240).limbah(20).build(),
                        DashboardStatsResponse.ChartData.builder().name("Sel").masuk(300).keluar(139).limbah(15).build(),
                        DashboardStatsResponse.ChartData.builder().name("Rab").masuk(200).keluar(880).limbah(40).build(),
                        DashboardStatsResponse.ChartData.builder().name("Kam").masuk(278).keluar(390).limbah(10).build(),
                        DashboardStatsResponse.ChartData.builder().name("Jum").masuk(189).keluar(480).limbah(5).build()
                ))
                .build();
    }

    private boolean isInbound(MovementType type) {
        return switch (type) {
            case PURCHASE_IN, TRANSFER_IN, ADJUSTMENT_IN, REVERSAL_IN -> true;
            default -> false;
        };
    }

    private InventoryResponse toResponse(Inventory inv) {
        boolean isBusiness = false;
        if (inv.getInventoryAccount() != null && inv.getInventoryAccount().getOwnerBusinessEntity() != null) {
            isBusiness = true;
        }
        
        return InventoryResponse.builder()
                .id(inv.getId())
                .accountId(inv.getInventoryAccount() != null ? inv.getInventoryAccount().getId() : null)
                .accountType(isBusiness ? "BUSINESS_ENTITY" : "USER")
                .batchId(inv.getBatchId())
                .quantity(inv.getQuantity())
                .reservedQuantity(inv.getReservedQuantity())
                .availableQuantity(inv.getQuantity().subtract(inv.getReservedQuantity()))
                .updatedAt(inv.getUpdatedAt())
                .build();
    }
}
