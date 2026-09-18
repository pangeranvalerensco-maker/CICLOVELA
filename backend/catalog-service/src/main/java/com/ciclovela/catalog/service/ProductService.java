package com.ciclovela.catalog.service;

import com.ciclovela.catalog.dto.request.ProductRequest;
import com.ciclovela.catalog.dto.response.ProductCategoryResponse;
import com.ciclovela.catalog.dto.response.ProductResponse;
import com.ciclovela.catalog.entity.Product;
import com.ciclovela.catalog.entity.ProductCategory;
import com.ciclovela.catalog.enums.RecordStatus;
import com.ciclovela.catalog.exception.DuplicateResourceException;
import com.ciclovela.catalog.exception.ResourceNotFoundException;
import com.ciclovela.catalog.exception.BadRequestException;
import com.ciclovela.catalog.repository.ProductCategoryRepository;
import com.ciclovela.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(String search, UUID categoryId, RecordStatus status, Pageable pageable) {
        boolean searchFlag = search != null && !search.trim().isEmpty();
        String safeSearch = search == null ? "" : search;
        return productRepository.findAllWithFilters(safeSearch, searchFlag, categoryId, status, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(UUID id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, UUID userId) {
        String finalSku = request.getSku();
        if (finalSku == null || finalSku.trim().isEmpty()) {
            // Auto generate SKU jika kosong
            finalSku = "PRD-" + System.currentTimeMillis() % 1000000;
        } else {
            if (productRepository.existsBySkuIgnoreCase(finalSku)) {
                throw new DuplicateResourceException("SKU sudah digunakan");
            }
        }

        ProductCategory category;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
        } else if (request.getNewCategoryName() != null && !request.getNewCategoryName().trim().isEmpty()) {
            if (categoryRepository.existsByNameIgnoreCase(request.getNewCategoryName().trim())) {
                throw new DuplicateResourceException("Nama kategori sudah digunakan. Silakan pilih dari dropdown.");
            }
            category = ProductCategory.builder()
                    .name(request.getNewCategoryName().trim())
                    .description("Ditambahkan otomatis")
                    .status(RecordStatus.ACTIVE)
                    .build();
            category = categoryRepository.save(category);
        } else {
            throw new BadRequestException("Kategori wajib diisi");
        }

        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .sku(finalSku)
                .description(request.getDescription())
                .unit(request.getUnit())
                .shelfLifeDays(request.getShelfLifeDays())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus() != null ? request.getStatus() : RecordStatus.ACTIVE)
                .createdBy(userId)
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request, UUID userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));

        if (!product.getCreatedBy().equals(userId)) {
            throw new com.ciclovela.catalog.exception.AccessDeniedException("Anda tidak memiliki hak untuk mengubah produk ini");
        }

        String finalSku = request.getSku();
        if (finalSku == null || finalSku.trim().isEmpty()) {
            finalSku = product.getSku(); // Jika diubah jadi kosong, biarkan SKU lama
        } else if (!finalSku.equalsIgnoreCase(product.getSku()) &&
                productRepository.existsBySkuIgnoreCase(finalSku)) {
            throw new DuplicateResourceException("SKU sudah digunakan");
        }

        ProductCategory category;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kategori tidak ditemukan"));
        } else if (request.getNewCategoryName() != null && !request.getNewCategoryName().trim().isEmpty()) {
            if (categoryRepository.existsByNameIgnoreCase(request.getNewCategoryName().trim())) {
                throw new DuplicateResourceException("Nama kategori sudah digunakan. Silakan pilih dari dropdown.");
            }
            category = ProductCategory.builder()
                    .name(request.getNewCategoryName().trim())
                    .description("Ditambahkan otomatis")
                    .status(RecordStatus.ACTIVE)
                    .build();
            category = categoryRepository.save(category);
        } else {
            throw new BadRequestException("Kategori wajib diisi");
        }

        product.setCategory(category);
        product.setName(request.getName());
        product.setSku(finalSku);
        product.setDescription(request.getDescription());
        product.setUnit(request.getUnit());
        product.setShelfLifeDays(request.getShelfLifeDays());
        product.setImageUrl(request.getImageUrl());
        
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void softDeleteProduct(UUID id, UUID userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produk tidak ditemukan"));
        
        if (!product.getCreatedBy().equals(userId)) {
            throw new com.ciclovela.catalog.exception.AccessDeniedException("Anda tidak memiliki hak untuk menghapus produk ini");
        }

        product.setDeletedAt(OffsetDateTime.now());
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        ProductCategoryResponse categoryResponse = ProductCategoryResponse.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .build();

        return ProductResponse.builder()
                .id(product.getId())
                .category(categoryResponse)
                .name(product.getName())
                .sku(product.getSku())
                .description(product.getDescription())
                .unit(product.getUnit().name())
                .shelfLifeDays(product.getShelfLifeDays())
                .status(product.getStatus().name())
                .imageUrl(product.getImageUrl())
                .createdBy(product.getCreatedBy())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
