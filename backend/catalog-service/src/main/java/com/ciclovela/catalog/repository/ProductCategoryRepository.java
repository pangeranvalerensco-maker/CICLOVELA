package com.ciclovela.catalog.repository;

import com.ciclovela.catalog.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {
    boolean existsByNameIgnoreCase(String name);
}
