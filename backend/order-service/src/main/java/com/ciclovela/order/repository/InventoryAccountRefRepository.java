package com.ciclovela.order.repository;

import com.ciclovela.order.entity.InventoryAccountRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryAccountRefRepository extends JpaRepository<InventoryAccountRef, UUID> {
    Optional<InventoryAccountRef> findByOwnerUserId(UUID userId);
    Optional<InventoryAccountRef> findByOwnerBusinessEntityId(UUID entityId);
}
