package com.ciclovela.catalog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class BatchResponse {
    private UUID id;
    private String batchCode;
    private UUID productId;
    private String productName;
    private UUID farmerId;
    private LocalDate harvestDate;
    private BigDecimal initialQuantity;
    private String unit;
    private String qualityGrade;
    private LocalDate expiryDate;
    private String status;
    private OffsetDateTime createdAt;
}
