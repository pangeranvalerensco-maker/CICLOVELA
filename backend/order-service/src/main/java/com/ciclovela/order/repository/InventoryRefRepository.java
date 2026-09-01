package com.ciclovela.order.repository;

import com.ciclovela.order.entity.InventoryRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRefRepository extends JpaRepository<InventoryRef, UUID> {
    Optional<InventoryRef> findByInventoryAccountIdAndBatchId(UUID accountId, UUID batchId);
}
