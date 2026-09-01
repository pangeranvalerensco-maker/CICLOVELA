package com.ciclovela.catalog.controller;

import com.ciclovela.catalog.dto.request.ProductRequest;
import com.ciclovela.catalog.dto.response.ApiResponse;
import com.ciclovela.catalog.dto.response.ProductResponse;
import com.ciclovela.catalog.enums.RecordStatus;
import com.ciclovela.catalog.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) RecordStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<ProductResponse> page = service.getAllProducts(search, categoryId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data produk", page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Berhasil mengambil detail produk", service.getProduct(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN', 'FARMER')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UUID userId) {
        
        ProductResponse data = service.createProduct(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Produk berhasil dibuat", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN', 'FARMER')")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
        
        return ResponseEntity.ok(ApiResponse.success(
                "Produk berhasil diperbarui", service.updateProduct(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.softDeleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Produk berhasil dihapus", null));
    }
}
