package com.ciclovela.order.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PurchaseRequest {

    @NotNull(message = "ID Entitas pembeli wajib diisi")
    private UUID buyerEntityId;

    @NotNull(message = "ID Farmer penjual wajib diisi")
    private UUID sellerFarmerId;

    @NotEmpty(message = "Minimal satu item pembelian")
    @Valid
    private List<OrderItemRequest> items;

    private String notes;
}
