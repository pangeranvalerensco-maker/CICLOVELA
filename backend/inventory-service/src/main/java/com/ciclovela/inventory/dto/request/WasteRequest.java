package com.ciclovela.inventory.dto.request;

import com.ciclovela.inventory.enums.WasteReason;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class WasteRequest {

    @NotNull(message = "ID Inventory wajib diisi")
    private UUID inventoryId;

    @NotNull(message = "Kuantitas wajib diisi")
    @DecimalMin(value = "0.001", message = "Kuantitas harus lebih dari 0")
    private BigDecimal quantity;

    @NotNull(message = "Alasan waste wajib diisi")
    private WasteReason reason;

    private String notes;
}
