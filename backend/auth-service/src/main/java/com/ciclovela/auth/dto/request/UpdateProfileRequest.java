package com.ciclovela.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Nama wajib diisi")
    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String name;

    @Size(max = 20, message = "Nomor telepon maksimal 20 karakter")
    private String phone;

    @Size(max = 20, message = "Gender maksimal 20 karakter")
    private String gender;

    private LocalDate dateOfBirth;

    private String address;

    @Size(max = 100, message = "Kota maksimal 100 karakter")
    private String city;

    @Size(max = 100, message = "Provinsi maksimal 100 karakter")
    private String province;

    @Size(max = 10, message = "Kode pos maksimal 10 karakter")
    private String postalCode;
}
