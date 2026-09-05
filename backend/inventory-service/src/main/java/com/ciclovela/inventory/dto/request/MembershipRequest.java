package com.ciclovela.inventory.dto.request;

import com.ciclovela.inventory.enums.MembershipRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class MembershipRequest {
    @NotNull(message = "ID User wajib diisi")
    private UUID userId;

    @NotNull(message = "Peran (Role) wajib diisi")
    private MembershipRole role;
}
