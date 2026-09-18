package com.ciclovela.inventory.repository;

import com.ciclovela.inventory.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    
    Optional<Inventory> findByInventoryAccountIdAndBatchId(UUID accountId, UUID batchId);

    java.util.List<Inventory> findByInventoryAccountIdOrderByUpdatedAtDesc(UUID accountId);
    
    @Query("SELECT i FROM Inventory i WHERE " +
            "(:accountId IS NULL OR i.inventoryAccount.id = :accountId) AND " +
            "(:searchFlag = false OR i.batchId IN :batchIds) AND " +
            "(:accountType IS NULL OR " +
            "   (:accountType = 'USER' AND i.inventoryAccount.ownerUserId IS NOT NULL) OR " +
            "   (:accountType = 'BUSINESS_ENTITY' AND i.inventoryAccount.ownerBusinessEntity IS NOT NULL)" +
            ") AND " +
            "(i.inventoryAccount.ownerUserId = :actorId OR i.inventoryAccount.ownerBusinessEntity.id IN :allowedEntityIds)")
    Page<Inventory> findAllSecured(
            @Param("accountId") UUID accountId,
            @Param("searchFlag") boolean searchFlag,
            @Param("batchIds") java.util.List<UUID> batchIds,
            @Param("accountType") String accountType,
            @Param("actorId") UUID actorId,
            @Param("allowedEntityIds") java.util.List<UUID> allowedEntityIds,
            Pageable pageable);
}
