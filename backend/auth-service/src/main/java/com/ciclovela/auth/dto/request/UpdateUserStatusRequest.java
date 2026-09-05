package com.ciclovela.auth.dto.request;

import com.ciclovela.auth.enums.UserRole;
import com.ciclovela.auth.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserStatusRequest {

    @NotNull(message = "Status wajib diisi")
    private UserStatus status;
    
    private UserRole role;
}
