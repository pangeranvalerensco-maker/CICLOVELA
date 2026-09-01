package com.ciclovela.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class BusinessEntityResponse {
    private UUID id;
    private String name;
    private String businessType;
    private String legalName;
    private String description;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String province;
    private String postalCode;
    private String verificationStatus;
    private String status;
    private String verificationDocumentUrl;
    private UUID createdBy;
    private UUID approvedBy;
    private OffsetDateTime approvedAt;
    private OffsetDateTime createdAt;
}
