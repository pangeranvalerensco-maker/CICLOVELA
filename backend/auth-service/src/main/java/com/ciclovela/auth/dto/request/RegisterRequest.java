package com.ciclovela.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Nama wajib diisi")
    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String name;

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    @Size(max = 150, message = "Email maksimal 150 karakter")
    private String email;

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 8, max = 100, message = "Password minimal 8 karakter")
    private String password;

    @NotBlank(message = "Konfirmasi password wajib diisi")
    private String passwordConfirmation;

    private String role;
}
