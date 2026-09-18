package com.ciclovela.catalog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class FarmerOptionResponse {
    private UUID id;
    private String name;
}
