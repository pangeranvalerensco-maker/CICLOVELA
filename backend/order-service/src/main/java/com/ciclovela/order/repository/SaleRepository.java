package com.ciclovela.order.repository;

import com.ciclovela.order.entity.Sale;
import com.ciclovela.order.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {

    @Query("SELECT s FROM Sale s WHERE " +
            "(:sellerEntityId IS NULL OR s.sellerEntityId = :sellerEntityId) AND " +
            "(:buyerEntityId IS NULL OR s.buyerEntityId = :buyerEntityId) AND " +
            "(:buyerUserId IS NULL OR s.buyerUserId = :buyerUserId) AND " +
            "(:status IS NULL OR s.status = :status)")
    Page<Sale> findAllWithFilters(
            @Param("sellerEntityId") UUID sellerEntityId,
            @Param("buyerEntityId") UUID buyerEntityId,
            @Param("buyerUserId") UUID buyerUserId,
            @Param("status") TransactionStatus status,
            Pageable pageable);
}
