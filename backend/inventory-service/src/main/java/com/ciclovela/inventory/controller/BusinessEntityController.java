package com.ciclovela.inventory.controller;

import com.ciclovela.inventory.dto.request.BusinessEntityRequest;
import com.ciclovela.inventory.dto.response.ApiResponse;
import com.ciclovela.inventory.dto.response.BusinessEntityResponse;
import com.ciclovela.inventory.enums.EntityStatus;
import com.ciclovela.inventory.enums.VerificationStatus;
import com.ciclovela.inventory.service.BusinessEntityService;
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
@RequestMapping("/api/business-entities")
@RequiredArgsConstructor
public class BusinessEntityController {

    private final BusinessEntityService service;

    @GetMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Page<BusinessEntityResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) VerificationStatus verificationStatus,
            @RequestParam(required = false) EntityStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<BusinessEntityResponse> page = service.getAllEntities(search, verificationStatus, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data entitas bisnis", page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusinessEntityResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil detail entitas", service.getEntity(id)));
    }

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<BusinessEntityResponse>> createRequest(
            @Valid @RequestBody BusinessEntityRequest request,
            @AuthenticationPrincipal UUID userId) {
        
        BusinessEntityResponse data = service.createRequest(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Permintaan pembuatan entitas berhasil dikirim", data));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<BusinessEntityResponse>> approveEntity(
            @PathVariable UUID id,
            @AuthenticationPrincipal UUID adminId) {
        
        BusinessEntityResponse data = service.approveEntity(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Entitas bisnis berhasil disetujui", data));
    }
}
