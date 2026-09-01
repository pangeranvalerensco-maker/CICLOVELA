package com.ciclovela.catalog.service;

import com.ciclovela.catalog.dto.request.ProductCategoryRequest;
import com.ciclovela.catalog.dto.response.ProductCategoryResponse;
import com.ciclovela.catalog.entity.ProductCategory;
import com.ciclovela.catalog.enums.RecordStatus;
import com.ciclovela.catalog.exception.DuplicateResourceException;
import com.ciclovela.catalog.exception.ResourceNotFoundException;
import com.ciclovela.catalog.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {

    private final ProductCategoryRepository repository;

    @Transactional(readOnly = true)
    public Page<ProductCategoryResponse> getAllCategories(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductCategoryResponse getCategory(UUID id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
    }

    @Transactional
    public ProductCategoryResponse createCategory(ProductCategoryRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Nama kategori sudah digunakan");
        }

        ProductCategory category = ProductCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : RecordStatus.ACTIVE)
                .build();

        return toResponse(repository.save(category));
    }

    @Transactional
    public ProductCategoryResponse updateCategory(UUID id, ProductCategoryRequest request) {
        ProductCategory category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));

        if (!category.getName().equalsIgnoreCase(request.getName()) && 
            repository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Nama kategori sudah digunakan");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            category.setStatus(request.getStatus());
        }

        return toResponse(repository.save(category));
    }

    @Transactional
    public void softDeleteCategory(UUID id) {
        ProductCategory category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
        
        category.setDeletedAt(OffsetDateTime.now());
        repository.save(category);
    }

    private ProductCategoryResponse toResponse(ProductCategory category) {
        return ProductCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .status(category.getStatus().name())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
