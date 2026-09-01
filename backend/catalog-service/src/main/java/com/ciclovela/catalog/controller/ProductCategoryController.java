package com.ciclovela.catalog.controller;

import com.ciclovela.catalog.dto.request.ProductCategoryRequest;
import com.ciclovela.catalog.dto.response.ApiResponse;
import com.ciclovela.catalog.dto.response.ProductCategoryResponse;
import com.ciclovela.catalog.service.ProductCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductCategoryResponse>>> getAll(
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<ProductCategoryResponse> page = service.getAllCategories(pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data kategori", page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductCategoryResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Berhasil mengambil detail kategori", service.getCategory(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<ProductCategoryResponse>> create(
            @Valid @RequestBody ProductCategoryRequest request) {
        
        ProductCategoryResponse data = service.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Kategori berhasil dibuat", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<ProductCategoryResponse>> update(
            @PathVariable UUID id, @Valid @RequestBody ProductCategoryRequest request) {
        
        return ResponseEntity.ok(ApiResponse.success(
                "Kategori berhasil diperbarui", service.updateCategory(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.softDeleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Kategori berhasil dihapus", null));
    }
}
