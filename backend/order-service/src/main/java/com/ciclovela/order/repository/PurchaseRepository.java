package com.ciclovela.order.repository;

import com.ciclovela.order.entity.Purchase;
import com.ciclovela.order.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {

    @Query("SELECT p FROM Purchase p WHERE " +
            "(:buyerEntityId IS NULL OR p.buyerEntityId = :buyerEntityId) AND " +
            "(:sellerFarmerId IS NULL OR p.sellerFarmerId = :sellerFarmerId) AND " +
            "(:status IS NULL OR p.status = :status)")
    Page<Purchase> findAllWithFilters(
            @Param("buyerEntityId") UUID buyerEntityId,
            @Param("sellerFarmerId") UUID sellerFarmerId,
            @Param("status") TransactionStatus status,
            Pageable pageable);
}
