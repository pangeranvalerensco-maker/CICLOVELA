package com.ciclovela.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class MembershipResponse {
    private UUID id;
    private UUID userId;
    private UUID businessEntityId;
    private UUID businessAccountId;
    private String businessName;
    private String businessType;
    private String role;
    private String status;
    private OffsetDateTime joinedAt;
}
