package com.ciclovela.catalog.repository;

import com.ciclovela.catalog.entity.Batch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BatchRepository extends JpaRepository<Batch, UUID> {
    boolean existsByBatchCodeIgnoreCase(String batchCode);

    @Query("SELECT b FROM Batch b WHERE " +
            "(:search IS NULL OR LOWER(b.batchCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:productId IS NULL OR b.product.id = :productId) AND " +
            "(:farmerId IS NULL OR b.farmerId = :farmerId) AND " +
            "(:status IS NULL OR b.status = :status)")
    Page<Batch> findAllWithFilters(
            @Param("search") String search,
            @Param("productId") UUID productId,
            @Param("farmerId") UUID farmerId,
            @Param("status") com.ciclovela.catalog.enums.BatchStatus status,
            Pageable pageable);
}
