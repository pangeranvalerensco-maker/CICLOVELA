package com.ciclovela.order.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PurchaseResponse {
    private UUID id;
    private String transactionCode;
    private UUID buyerEntityId;
    private UUID sellerFarmerId;
    private OffsetDateTime transactionDate;
    private String status;
    private BigDecimal totalAmount;
    private String notes;
    private List<ItemResponse> items;
    private OffsetDateTime createdAt;

    @Data
    @Builder
    public static class ItemResponse {
        private UUID id;
        private UUID batchId;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
