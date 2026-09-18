package com.ciclovela.catalog.repository;

import com.ciclovela.catalog.entity.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT c FROM ProductCategory c WHERE " +
            "(:searchFlag = false OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:status IS NULL OR c.status = :status)")
    Page<ProductCategory> findAllWithFilters(
            @Param("search") String search,
            @Param("searchFlag") boolean searchFlag,
            @Param("status") com.ciclovela.catalog.enums.RecordStatus status,
            Pageable pageable);
}
