package com.ciclovela.auth.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserOptionResponse {
    private UUID id;
    private String name;
    private String email;
    private String role;
}
