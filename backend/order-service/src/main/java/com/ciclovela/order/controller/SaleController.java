package com.ciclovela.order.controller;

import com.ciclovela.order.dto.request.SaleRequest;
import com.ciclovela.order.dto.response.ApiResponse;
import com.ciclovela.order.dto.response.SaleResponse;
import com.ciclovela.order.enums.TransactionStatus;
import com.ciclovela.order.service.SaleService;
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
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'ENTITY_ADMIN', 'CONSUMER')")
    public ResponseEntity<ApiResponse<Page<SaleResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID sellerEntityId,
            @RequestParam(required = false) UUID buyerEntityId,
            @RequestParam(required = false) UUID buyerUserId,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime endDate,
            @PageableDefault(size = 10) Pageable pageable,
            @AuthenticationPrincipal UUID actorId) {

        Page<SaleResponse> page = service.getAllSales(search, sellerEntityId, buyerEntityId, buyerUserId, status, startDate, endDate, actorId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data penjualan", page));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'ENTITY_ADMIN', 'CONSUMER')")
    public ResponseEntity<ApiResponse<SaleResponse>> getById(@PathVariable UUID id, @AuthenticationPrincipal UUID actorId) {
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil detail penjualan", service.getSale(id, actorId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'ENTITY_ADMIN')")
    public ResponseEntity<ApiResponse<SaleResponse>> create(
            @Valid @RequestBody SaleRequest request,
            @AuthenticationPrincipal UUID userId) {
        SaleResponse data = service.createSale(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Penjualan berhasil dibuat", data));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'ENTITY_ADMIN', 'CONSUMER')")
    public ResponseEntity<ApiResponse<SaleResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TransactionStatus status,
            @AuthenticationPrincipal UUID userId) {

        SaleResponse data = service.updateStatus(id, status, userId);
        return ResponseEntity.ok(ApiResponse.success("Status penjualan berhasil diperbarui", data));
    }
}
