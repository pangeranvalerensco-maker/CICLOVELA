package com.ciclovela.inventory.dto.request;

import com.ciclovela.inventory.enums.BusinessType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BusinessEntityRequest {

    @NotBlank(message = "Nama entitas wajib diisi")
    private String name;

    @NotNull(message = "Tipe bisnis wajib diisi (DISTRIBUTOR / RETAILER)")
    private BusinessType businessType;

    private String legalName;
    private String description;
    private String phone;

    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Alamat wajib diisi")
    private String address;

    @NotBlank(message = "Kota wajib diisi")
    private String city;

    @NotBlank(message = "Provinsi wajib diisi")
    private String province;

    private String postalCode;
    
    private String verificationDocumentUrl;
}
