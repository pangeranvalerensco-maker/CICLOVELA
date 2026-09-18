package com.ciclovela.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class WasteResponse {
    private UUID id;
    private UUID batchId;
    private UUID inventoryId;
    private BigDecimal quantity;
    private String reason;
    private String notes;
    private UUID recordedBy;
    private OffsetDateTime recordedAt;
}
