package com.ciclovela.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class InventoryOptionResponse {
    private UUID id;
    private UUID accountId;
    private UUID batchId;
    private BigDecimal availableQuantity;
}
