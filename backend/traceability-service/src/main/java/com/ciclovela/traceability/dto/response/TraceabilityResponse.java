package com.ciclovela.traceability.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TraceabilityResponse {

    private UUID batchId;
    private String batchCode;
    private String productName;
    private String farmerName;
    private LocalDate harvestDate;
    private LocalDate expiryDate;
    private BigDecimal initialQuantity;
    private String unit;
    private String qualityGrade;
    private String batchStatus;
    
    private List<TimelineEvent> timeline;

    @Data
    @Builder
    public static class TimelineEvent {
        private OffsetDateTime timestamp;
        private String eventType; // PURCHASE_IN, TRANSFER_IN, dsb.
        private BigDecimal quantity;
        private String description;
    }
}
