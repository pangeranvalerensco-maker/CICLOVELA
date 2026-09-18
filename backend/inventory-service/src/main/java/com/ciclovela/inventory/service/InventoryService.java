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

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryAccountRepository accountRepository;
    private final InventoryMovementRepository movementRepository;
    private final WasteRepository wasteRepository;
    private final com.ciclovela.inventory.repository.BusinessMembershipRepository membershipRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public Page<InventoryResponse> getInventories(UUID accountId, String search, String accountType, UUID actorId, Pageable pageable) {
        java.util.List<UUID> allowedEntities = membershipRepository.findByUserId(actorId).stream()
                .filter(m -> "ACTIVE".equals(m.getStatus().name()))
                .map(m -> m.getBusinessEntity().getId())
                .toList();

        if (allowedEntities.isEmpty()) {
            allowedEntities = java.util.List.of(UUID.randomUUID());
        }

        java.util.List<UUID> batchIds = new java.util.ArrayList<>();
        boolean searchFlag = false;
        if (search != null && !search.trim().isEmpty()) {
            searchFlag = true;
            String q = "%" + search.trim().toLowerCase() + "%";
            String sql = "SELECT CAST(b.id AS text) FROM batches b JOIN products p ON b.product_id = p.id " +
                         "WHERE LOWER(b.batch_code) LIKE ? OR LOWER(p.name) LIKE ? OR LOWER(CAST(b.id AS text)) LIKE ?";
            java.util.List<String> bIds = jdbcTemplate.queryForList(sql, String.class, q, q, q);
            if (bIds.isEmpty()) {
                return Page.empty(pageable);
            }
            batchIds = bIds.stream().map(UUID::fromString).toList();
        }

        return inventoryRepository.findAllSecured(accountId, searchFlag, batchIds, accountType, actorId, allowedEntities, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public java.util.List<com.ciclovela.inventory.dto.response.InventoryOptionResponse> getInventoryOptions(UUID entityId, UUID actorId) {
        boolean isMember = membershipRepository.findByUserIdAndBusinessEntityId(actorId, entityId)
                .map(m -> "ACTIVE".equals(m.getStatus().name()))
                .orElse(false);
        if (!isMember) {
            throw new com.ciclovela.inventory.exception.AccessDeniedException("Anda bukan anggota aktif dari bisnis ini.");
        }

        return accountRepository.findByOwnerBusinessEntityId(entityId)
                .map(account -> inventoryRepository.findByInventoryAccountIdOrderByUpdatedAtDesc(account.getId()).stream()
                        .filter(inventory -> inventory.getQuantity().subtract(inventory.getReservedQuantity()).compareTo(java.math.BigDecimal.ZERO) > 0)
                        .map(inventory -> com.ciclovela.inventory.dto.response.InventoryOptionResponse.builder()
                                .id(inventory.getId())
                                .accountId(account.getId())
                                .batchId(inventory.getBatchId())
                                .availableQuantity(inventory.getQuantity().subtract(inventory.getReservedQuantity()))
                                .build())
                        .toList())
                .orElse(java.util.List.of());
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryDetail(UUID id, UUID actorId) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory tidak ditemukan"));
        
        validateInventoryOwnership(inventory, actorId);
        return toResponse(inventory);
    }

    private void validateInventoryOwnership(Inventory inventory, UUID actorId) {
        InventoryAccount account = inventory.getInventoryAccount();
        if (account.getOwnerUserId() != null) {
            if (!account.getOwnerUserId().equals(actorId)) {
                throw new com.ciclovela.inventory.exception.AccessDeniedException("Anda tidak berhak mengakses inventory ini.");
            }
        } else if (account.getOwnerBusinessEntity() != null) {
            boolean isMember = membershipRepository.findByUserIdAndBusinessEntityId(actorId, account.getOwnerBusinessEntity().getId())
                    .map(m -> "ACTIVE".equals(m.getStatus().name()))
                    .orElse(false);
            if (!isMember) {
                throw new com.ciclovela.inventory.exception.AccessDeniedException("Anda bukan anggota aktif dari bisnis pemilik inventory ini.");
            }
        }
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

    @Transactional(readOnly = true)
    public Page<com.ciclovela.inventory.dto.response.WasteResponse> getWasteRecords(UUID actorId, Pageable pageable) {
        java.util.Set<UUID> allowedInventoryIds = new java.util.HashSet<>();

        accountRepository.findByOwnerUserId(actorId).ifPresent(a ->
            inventoryRepository.findByInventoryAccountIdOrderByUpdatedAtDesc(a.getId())
                .forEach(i -> allowedInventoryIds.add(i.getId())));

        java.util.List<UUID> allowedEntities = membershipRepository.findByUserId(actorId).stream()
                .filter(m -> "ACTIVE".equals(m.getStatus().name()))
                .map(m -> m.getBusinessEntity().getId())
                .toList();
        for (UUID entityId : allowedEntities) {
            accountRepository.findByOwnerBusinessEntityId(entityId).ifPresent(a ->
                inventoryRepository.findByInventoryAccountIdOrderByUpdatedAtDesc(a.getId())
                    .forEach(i -> allowedInventoryIds.add(i.getId())));
        }

        if (allowedInventoryIds.isEmpty()) {
            return Page.empty(pageable);
        }

        return wasteRepository.findByInventoryIdInOrderByRecordedAtDesc(
                new java.util.ArrayList<>(allowedInventoryIds), pageable)
            .map(w -> com.ciclovela.inventory.dto.response.WasteResponse.builder()
                .id(w.getId())
                .batchId(w.getBatchId())
                .inventoryId(w.getInventory().getId())
                .quantity(w.getQuantity())
                .reason(w.getReason().name())
                .notes(w.getNotes())
                .recordedBy(w.getRecordedBy())
                .recordedAt(w.getRecordedAt())
                .build());
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
        // Ambil list account yang berhak diakses user (personal + entitas bisnis)
        String accountsQuery = "SELECT id FROM inventory_accounts WHERE owner_user_id = ? " +
                               "UNION " +
                               "SELECT a.id FROM inventory_accounts a " +
                               "JOIN business_memberships m ON a.owner_business_entity_id = m.business_entity_id " +
                               "WHERE m.user_id = ? AND m.status = 'ACTIVE'";
        
        List<String> accountIds = jdbcTemplate.queryForList(accountsQuery, String.class, userId, userId);
        
        if (accountIds.isEmpty()) {
            return DashboardStatsResponse.builder()
                .totalInventoryQuantity(0L)
                .inboundTransactions(0)
                .outboundTransactions(0)
                .totalWasteRecorded(0L)
                .inventoryTrend(List.of(
                    DashboardStatsResponse.ChartData.builder().name("Sen").masuk(0).keluar(0).limbah(0).build()
                ))
                .expiringBatches(List.of())
                .recentActivities(List.of())
                .build();
        }

        // Konversi list accountIds ke format IN clause ('uuid1', 'uuid2')
        String inClause = String.join(",", accountIds.stream().map(id -> "'" + id + "'").toList());

        // 1. Total Inventory
        String totalInvQuery = "SELECT COALESCE(SUM(quantity), 0) FROM inventories WHERE inventory_account_id IN (" + inClause + ")";
        Long totalInventory = jdbcTemplate.queryForObject(totalInvQuery, Long.class);

        // 2. Total Waste
        String totalWasteQuery = "SELECT COALESCE(SUM(w.quantity), 0) FROM wastes w " +
                                 "JOIN inventories i ON w.inventory_id = i.id " +
                                 "WHERE i.inventory_account_id IN (" + inClause + ")";
        Long totalWaste = jdbcTemplate.queryForObject(totalWasteQuery, Long.class);

        // 3. Inbound & Outbound
        String inOutQuery = "SELECT " +
                            "  SUM(CASE WHEN movement_type IN ('PURCHASE_IN','TRANSFER_IN','ADJUSTMENT_IN','REVERSAL_IN') THEN 1 ELSE 0 END) as inbound_count, " +
                            "  SUM(CASE WHEN movement_type IN ('SALE_OUT','TRANSFER_OUT') THEN 1 ELSE 0 END) as outbound_count " +
                            "FROM inventory_movements m " +
                            "JOIN inventories i ON m.inventory_id = i.id " +
                            "WHERE i.inventory_account_id IN (" + inClause + ")";
        Map<String, Object> inOutCounts = jdbcTemplate.queryForMap(inOutQuery);
        int inbound = ((Number) inOutCounts.get("inbound_count")).intValue();
        int outbound = ((Number) inOutCounts.get("outbound_count")).intValue();

        // 4. Trend 7 Hari Terakhir (Sederhana)
        List<DashboardStatsResponse.ChartData> trend = new ArrayList<>();
        String trendQuery = "SELECT " +
                            "  to_char(m.created_at, 'Dy') as day_name, " +
                            "  EXTRACT(DOW FROM m.created_at) as dow, " +
                            "  SUM(CASE WHEN movement_type IN ('PURCHASE_IN','TRANSFER_IN','ADJUSTMENT_IN') THEN m.quantity ELSE 0 END) as masuk, " +
                            "  SUM(CASE WHEN movement_type IN ('SALE_OUT','TRANSFER_OUT') THEN m.quantity ELSE 0 END) as keluar, " +
                            "  SUM(CASE WHEN movement_type = 'WASTE_OUT' THEN m.quantity ELSE 0 END) as limbah " +
                            "FROM inventory_movements m " +
                            "JOIN inventories i ON m.inventory_id = i.id " +
                            "WHERE i.inventory_account_id IN (" + inClause + ") " +
                            "  AND m.created_at >= NOW() - INTERVAL '7 days' " +
                            "GROUP BY day_name, dow " +
                            "ORDER BY dow";
        
        List<Map<String, Object>> trendRows = jdbcTemplate.queryForList(trendQuery);
        if (trendRows.isEmpty()) {
            trend.add(DashboardStatsResponse.ChartData.builder().name("Sen").masuk(0).keluar(0).limbah(0).build());
        } else {
            for (Map<String, Object> row : trendRows) {
                String dayName = (String) row.get("day_name");
                // Translate day name for ID
                String idDay = switch(dayName) {
                    case "Sun" -> "Min"; case "Mon" -> "Sen"; case "Tue" -> "Sel";
                    case "Wed" -> "Rab"; case "Thu" -> "Kam"; case "Fri" -> "Jum";
                    case "Sat" -> "Sab"; default -> dayName;
                };
                trend.add(DashboardStatsResponse.ChartData.builder()
                        .name(idDay)
                        .masuk(((Number) row.get("masuk")).longValue())
                        .keluar(((Number) row.get("keluar")).longValue())
                        .limbah(((Number) row.get("limbah")).longValue())
                        .build());
            }
        }

        List<DashboardStatsResponse.ExpiringBatch> expiringBatches = new ArrayList<>();
        String expiringQuery = "SELECT CAST(b.id AS text) AS id, p.name AS product_name, " +
                "  (b.expiry_date - CURRENT_DATE) AS days_left, " +
                "  CONCAT(COALESCE(i.quantity, 0), ' ', b.unit) AS qty " +
                "FROM inventories i " +
                "JOIN batches b ON i.batch_id = b.id " +
                "JOIN products p ON b.product_id = p.id " +
                "WHERE i.inventory_account_id IN (" + inClause + ") " +
                "  AND b.status = 'ACTIVE' " +
                "  AND b.expiry_date <= CURRENT_DATE + INTERVAL '7 days' " +
                "ORDER BY b.expiry_date ASC LIMIT 5";
        for (Map<String, Object> row : jdbcTemplate.queryForList(expiringQuery)) {
            expiringBatches.add(DashboardStatsResponse.ExpiringBatch.builder()
                    .id(String.valueOf(row.get("id")))
                    .product(String.valueOf(row.get("product_name")))
                    .daysLeft(((Number) row.get("days_left")).longValue())
                    .qty(String.valueOf(row.get("qty")))
                    .build());
        }

        List<DashboardStatsResponse.RecentActivity> recentActivities = new ArrayList<>();
        String recentQuery = "SELECT CAST(m.id AS text) AS id, m.movement_type AS event_type, " +
                "  m.description AS description, p.name AS product_name, m.created_at AS created_at, m.quantity AS quantity " +
                "FROM inventory_movements m " +
                "JOIN inventories i ON m.inventory_id = i.id " +
                "JOIN batches b ON i.batch_id = b.id " +
                "JOIN products p ON b.product_id = p.id " +
                "WHERE i.inventory_account_id IN (" + inClause + ") " +
                "ORDER BY m.created_at DESC LIMIT 5";
        for (Map<String, Object> row : jdbcTemplate.queryForList(recentQuery)) {
            String eventType = String.valueOf(row.get("event_type"));
            String status = switch(eventType) {
                case "PURCHASE_IN", "TRANSFER_IN", "ADJUSTMENT_IN", "REVERSAL_IN" -> "success";
                case "WASTE_OUT" -> "warning";
                default -> "info";
            };
            Object createdAt = row.get("created_at");
            recentActivities.add(DashboardStatsResponse.RecentActivity.builder()
                    .id(String.valueOf(row.get("id")))
                    .action(eventType.replace('_', ' '))
                    .target(String.format("%s (%s KG)", String.valueOf(row.get("product_name")), String.valueOf(row.get("quantity"))))
                    .time(createdAt == null ? "" : String.valueOf(createdAt))
                    .status(status)
                    .eventType(eventType)
                    .build());
        }

        return DashboardStatsResponse.builder()
                .totalInventoryQuantity(totalInventory != null ? totalInventory : 0L)
                .inboundTransactions(inbound)
                .outboundTransactions(outbound)
                .totalWasteRecorded(totalWaste != null ? totalWaste : 0L)
                .inventoryTrend(trend)
                .expiringBatches(expiringBatches)
                .recentActivities(recentActivities)
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

        String bCode = "";
        String pName = "";
        String iUrl = "";
        try {
            Map<String, Object> batchInfo = jdbcTemplate.queryForMap(
                "SELECT b.batch_code, p.name, p.image_url FROM batches b JOIN products p ON b.product_id = p.id WHERE b.id = CAST(? AS UUID)", 
                inv.getBatchId().toString()
            );
            bCode = String.valueOf(batchInfo.get("batch_code"));
            pName = String.valueOf(batchInfo.get("name"));
            Object img = batchInfo.get("image_url");
            if (img != null) iUrl = String.valueOf(img);
        } catch (Exception e) {}
        
        return InventoryResponse.builder()
                .id(inv.getId())
                .accountId(inv.getInventoryAccount() != null ? inv.getInventoryAccount().getId() : null)
                .accountType(isBusiness ? "BUSINESS_ENTITY" : "USER")
                .batchId(inv.getBatchId())
                .batchCode(bCode)
                .productName(pName)
                .imageUrl(iUrl)
                .quantity(inv.getQuantity())
                .reservedQuantity(inv.getReservedQuantity())
                .availableQuantity(inv.getQuantity().subtract(inv.getReservedQuantity()))
                .updatedAt(inv.getUpdatedAt())
                .build();
    }
}
