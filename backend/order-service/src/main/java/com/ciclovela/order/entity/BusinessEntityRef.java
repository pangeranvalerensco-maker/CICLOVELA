package com.ciclovela.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "business_entities")
@Getter
@NoArgsConstructor
public class BusinessEntityRef {

    @Id
    private UUID id;

    @Column(name = "business_type")
    private String businessType;

    @Column(name = "verification_status")
    private String verificationStatus;

    private String status;
}
