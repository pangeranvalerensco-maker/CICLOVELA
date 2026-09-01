package com.ciclovela.inventory.repository;

import com.ciclovela.inventory.entity.InventoryAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryAccountRepository extends JpaRepository<InventoryAccount, UUID> {
    
    Optional<InventoryAccount> findByOwnerUserId(UUID userId);
    
    Optional<InventoryAccount> findByOwnerBusinessEntityId(UUID entityId);
}
