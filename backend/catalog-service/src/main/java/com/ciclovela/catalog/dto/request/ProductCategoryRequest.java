package com.ciclovela.catalog.dto.request;

import com.ciclovela.catalog.enums.RecordStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductCategoryRequest {
    @NotBlank(message = "Nama kategori wajib diisi")
    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String name;

    private String description;

    private RecordStatus status;
}
