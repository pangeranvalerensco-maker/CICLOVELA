package com.ciclovela.catalog.dto.request;

import com.ciclovela.catalog.enums.BatchQuality;
import com.ciclovela.catalog.enums.ProductUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class BatchRequest {

    @NotBlank(message = "Kode batch wajib diisi")
    private String batchCode;

    @NotNull(message = "Produk wajib diisi")
    private UUID productId;

    @NotNull(message = "Tanggal panen wajib diisi")
    private LocalDate harvestDate;

    @NotNull(message = "Kuantitas awal wajib diisi")
    @DecimalMin(value = "0.001", message = "Kuantitas awal harus lebih dari 0")
    private BigDecimal initialQuantity;

    @NotNull(message = "Unit wajib diisi")
    private ProductUnit unit;

    private BatchQuality qualityGrade;

    @NotNull(message = "Tanggal kedaluwarsa wajib diisi")
    private LocalDate expiryDate;
}
