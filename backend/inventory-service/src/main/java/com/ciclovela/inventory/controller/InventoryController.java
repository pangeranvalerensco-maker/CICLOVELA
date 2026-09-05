package com.ciclovela.inventory.controller;

import com.ciclovela.inventory.dto.request.WasteRequest;
import com.ciclovela.inventory.dto.response.ApiResponse;
import com.ciclovela.inventory.dto.response.DashboardStatsResponse;
import com.ciclovela.inventory.dto.response.InventoryResponse;
import com.ciclovela.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;

    @GetMapping("/inventories")
    public ResponseEntity<ApiResponse<Page<InventoryResponse>>> getInventories(
            @RequestParam(required = false) UUID accountId,
            @RequestParam(required = false) UUID batchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryResponse> pageResult = service.getInventories(accountId, batchId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data inventory", pageResult));
    }

    @GetMapping("/inventories/{id}")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventory(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil detail inventory", service.getInventoryDetail(id)));
    }

    @GetMapping("/inventories/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(ApiResponse.success("Berhasil memuat statistik", service.getDashboardStats(userId)));
    }

    @PostMapping("/waste-records")
    public ResponseEntity<ApiResponse<Void>> recordWaste(
            @Valid @RequestBody WasteRequest request,
            @AuthenticationPrincipal UUID userId) {
        
        service.recordWaste(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Catatan limbah berhasil ditambahkan, inventory dikurangi", null));
    }
}
