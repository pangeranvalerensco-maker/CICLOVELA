package com.ciclovela.order.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class SaleRequest {

    @NotNull(message = "ID Entitas penjual wajib diisi")
    private UUID sellerEntityId;

    private UUID buyerEntityId;

    private UUID buyerUserId;

    @NotEmpty(message = "Minimal satu item penjualan")
    @Valid
    private List<OrderItemRequest> items;

    private String notes;
}
