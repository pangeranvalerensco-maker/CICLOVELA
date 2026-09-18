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
    java.util.List<Batch> findByStatusOrderByBatchCodeAsc(com.ciclovela.catalog.enums.BatchStatus status);
    java.util.List<Batch> findByStatusAndFarmerIdOrderByBatchCodeAsc(com.ciclovela.catalog.enums.BatchStatus status, UUID farmerId);
    boolean existsByBatchCodeIgnoreCase(String batchCode);

    @Query("SELECT b FROM Batch b WHERE " +
            "(:searchFlag = false OR LOWER(b.batchCode) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(b.product.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:productId IS NULL OR b.product.id = :productId) AND " +
            "(:farmerId IS NULL OR b.farmerId = :farmerId) AND " +
            "(:status IS NULL OR b.status = :status)")
    Page<Batch> findAllWithFilters(
            @Param("search") String search,
            @Param("searchFlag") boolean searchFlag,
            @Param("productId") UUID productId,
            @Param("farmerId") UUID farmerId,
            @Param("status") com.ciclovela.catalog.enums.BatchStatus status,
            Pageable pageable);
}
