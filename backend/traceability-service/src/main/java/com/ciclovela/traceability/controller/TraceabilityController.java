package com.ciclovela.traceability.controller;

import com.ciclovela.traceability.dto.response.ApiResponse;
import com.ciclovela.traceability.dto.response.TraceabilityResponse;
import com.ciclovela.traceability.service.TraceabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/traceability")
@RequiredArgsConstructor
public class TraceabilityController {

    private final TraceabilityService service;

    // Endpoint publik/internal untuk mendapatkan riwayat lengkap suatu batch
    @GetMapping("/batches/{id}")
    public ResponseEntity<ApiResponse<TraceabilityResponse>> getTraceabilityByBatchId(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Berhasil mengambil data traceability", service.getTraceabilityByBatchId(id)));
    }

    @GetMapping("/batches/code/{batchCode}")
    public ResponseEntity<ApiResponse<TraceabilityResponse>> getTraceabilityByBatchCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(ApiResponse.success(
                "Berhasil mengambil data traceability", service.getTraceabilityByBatchCode(batchCode)));
    }
}
