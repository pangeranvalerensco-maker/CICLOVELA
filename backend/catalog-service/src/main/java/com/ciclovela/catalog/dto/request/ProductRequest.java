package com.ciclovela.catalog.dto.request;

import com.ciclovela.catalog.enums.ProductUnit;
import com.ciclovela.catalog.enums.RecordStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ProductRequest {
    @NotNull(message = "Kategori wajib diisi")
    private UUID categoryId;

    @NotBlank(message = "Nama produk wajib diisi")
    private String name;

    private String sku;
    private String description;

    @NotNull(message = "Unit wajib diisi")
    private ProductUnit unit;

    private Integer shelfLifeDays;
    private RecordStatus status;
}
