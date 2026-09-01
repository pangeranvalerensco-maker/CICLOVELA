package com.ciclovela.inventory.repository;

import com.ciclovela.inventory.entity.Waste;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WasteRepository extends JpaRepository<Waste, UUID> {
    
    Page<Waste> findByInventoryId(UUID inventoryId, Pageable pageable);
}
