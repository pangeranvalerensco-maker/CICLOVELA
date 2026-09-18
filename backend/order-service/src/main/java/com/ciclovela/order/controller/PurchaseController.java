package com.ciclovela.order.controller;

import com.ciclovela.order.dto.request.PurchaseRequest;
import com.ciclovela.order.dto.response.ApiResponse;
import com.ciclovela.order.dto.response.PurchaseResponse;
import com.ciclovela.order.enums.TransactionStatus;
import com.ciclovela.order.service.PurchaseService;
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
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'ENTITY_ADMIN')")
    public ResponseEntity<ApiResponse<Page<PurchaseResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID buyerEntityId,
            @RequestParam(required = false) UUID sellerFarmerId,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime endDate,
            @PageableDefault(size = 10) Pageable pageable,
            @AuthenticationPrincipal UUID actorId) {

        Page<PurchaseResponse> page = service.getAllPurchases(search, buyerEntityId, sellerFarmerId, status, startDate, endDate, actorId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data pembelian", page));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'ENTITY_ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> getById(@PathVariable UUID id, @AuthenticationPrincipal UUID actorId) {
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil detail pembelian", service.getPurchase(id, actorId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'ENTITY_ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> create(
            @Valid @RequestBody PurchaseRequest request,
            @AuthenticationPrincipal UUID userId) {
        PurchaseResponse data = service.createPurchase(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pembelian berhasil dibuat", data));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'ENTITY_ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TransactionStatus status,
            @AuthenticationPrincipal UUID userId) {

        PurchaseResponse data = service.updateStatus(id, status, userId);
        return ResponseEntity.ok(ApiResponse.success("Status pembelian berhasil diperbarui", data));
    }
}
