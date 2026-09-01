package com.ciclovela.traceability.repository;

import com.ciclovela.traceability.entity.ProductTraceabilityView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductTraceabilityRepository extends JpaRepository<ProductTraceabilityView, UUID> {
    Optional<ProductTraceabilityView> findByBatchCode(String batchCode);
}
