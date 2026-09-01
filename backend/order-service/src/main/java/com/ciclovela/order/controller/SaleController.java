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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SaleResponse>>> getAll(
            @RequestParam(required = false) UUID sellerEntityId,
            @RequestParam(required = false) UUID buyerEntityId,
            @RequestParam(required = false) UUID buyerUserId,
            @RequestParam(required = false) TransactionStatus status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<SaleResponse> page = service.getAllSales(sellerEntityId, buyerEntityId, buyerUserId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data penjualan", page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SaleResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil detail penjualan", service.getSale(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SaleResponse>> create(@Valid @RequestBody SaleRequest request) {
        SaleResponse data = service.createSale(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Penjualan berhasil dibuat", data));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SaleResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TransactionStatus status,
            @AuthenticationPrincipal UUID userId) {

        SaleResponse data = service.updateStatus(id, status, userId);
        return ResponseEntity.ok(ApiResponse.success("Status penjualan berhasil diperbarui", data));
    }
}
