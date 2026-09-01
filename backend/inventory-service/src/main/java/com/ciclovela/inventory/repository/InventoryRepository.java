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
    
    @Query("SELECT i FROM Inventory i WHERE " +
            "(:accountId IS NULL OR i.inventoryAccount.id = :accountId) AND " +
            "(:batchId IS NULL OR i.batchId = :batchId)")
    Page<Inventory> findAllWithFilters(
            @Param("accountId") UUID accountId,
            @Param("batchId") UUID batchId,
            Pageable pageable);
}
