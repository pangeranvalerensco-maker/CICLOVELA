package com.ciclovela.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "business_memberships")
@Getter
@NoArgsConstructor
public class BusinessMembershipRef {
    @Id
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "business_entity_id")
    private UUID businessEntityId;

    private String role;
    
    private String status;
}
