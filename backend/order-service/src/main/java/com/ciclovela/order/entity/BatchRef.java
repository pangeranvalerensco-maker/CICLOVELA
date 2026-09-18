package com.ciclovela.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "batches")
@Getter
@NoArgsConstructor
public class BatchRef {

    @Id
    private UUID id;

    @Column(name = "batch_code")
    private String batchCode;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    private String status;
}
