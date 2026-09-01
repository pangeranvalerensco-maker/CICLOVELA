package com.ciclovela.traceability.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "v_product_traceability")
@Getter
@NoArgsConstructor
public class ProductTraceabilityView {

    @Id
    @Column(name = "batch_id")
    private UUID batchId;

    @Column(name = "batch_code")
    private String batchCode;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "farmer_id")
    private UUID farmerId;

    @Column(name = "farmer_name")
    private String farmerName;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "initial_quantity")
    private BigDecimal initialQuantity;

    private String unit;

    @Column(name = "quality_grade")
    private String qualityGrade;

    @Column(name = "batch_status")
    private String batchStatus;
}
