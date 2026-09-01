package com.ciclovela.catalog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private ProductCategoryResponse category;
    private String name;
    private String sku;
    private String description;
    private String unit;
    private Integer shelfLifeDays;
    private String status;
    private UUID createdBy;
    private OffsetDateTime createdAt;
}
