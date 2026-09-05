package com.ciclovela.catalog.controller;

import com.ciclovela.catalog.dto.request.BatchRequest;
import com.ciclovela.catalog.dto.response.ApiResponse;
import com.ciclovela.catalog.dto.response.BatchResponse;
import com.ciclovela.catalog.enums.BatchStatus;
import com.ciclovela.catalog.service.BatchService;
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
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BatchResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID productId,
            @RequestParam(required = false) UUID farmerId,
            @RequestParam(required = false) BatchStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<BatchResponse> page = service.getAllBatches(search, productId, farmerId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data batch", page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BatchResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Berhasil mengambil detail batch", service.getBatch(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<BatchResponse>> create(
            @Valid @RequestBody BatchRequest request,
            @AuthenticationPrincipal UUID userId) {
        
        BatchResponse data = service.createBatch(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch berhasil dibuat", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<BatchResponse>> update(
            @PathVariable UUID id, 
            @Valid @RequestBody BatchRequest request,
            @AuthenticationPrincipal UUID userId) {
        
        return ResponseEntity.ok(ApiResponse.success(
                "Batch berhasil diperbarui", service.updateBatch(id, request, userId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN', 'FARMER')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal UUID userId) {
        service.softDeleteBatch(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Batch berhasil dihapus", null));
    }
}
