package com.ciclovela.order.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class OrderItemRequest {

    @NotNull(message = "ID Batch wajib diisi")
    private UUID batchId;

    @NotNull(message = "Kuantitas wajib diisi")
    @DecimalMin(value = "0.001", message = "Kuantitas harus lebih dari 0")
    private BigDecimal quantity;

    @NotNull(message = "Harga satuan wajib diisi")
    @DecimalMin(value = "0", message = "Harga satuan tidak boleh negatif")
    private BigDecimal unitPrice;
}
