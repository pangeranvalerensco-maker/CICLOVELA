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
            "(:searchFlag = false OR LOWER(p.transactionCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:buyerEntityId IS NULL OR p.buyerEntityId = :buyerEntityId) AND " +
            "(:sellerFarmerId IS NULL OR p.sellerFarmerId = :sellerFarmerId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:startFlag = false OR p.transactionDate >= :startDate) AND " +
            "(:endFlag = false OR p.transactionDate <= :endDate) AND " +
            "(p.sellerFarmerId = :actorId OR p.buyerEntityId IN :allowedEntityIds)")
    Page<Purchase> findAllSecured(
            @Param("search") String search,
            @Param("searchFlag") boolean searchFlag,
            @Param("buyerEntityId") UUID buyerEntityId,
            @Param("sellerFarmerId") UUID sellerFarmerId,
            @Param("status") TransactionStatus status,
            @Param("startDate") java.time.OffsetDateTime startDate,
            @Param("endDate") java.time.OffsetDateTime endDate,
            @Param("startFlag") boolean startFlag,
            @Param("endFlag") boolean endFlag,
            @Param("actorId") UUID actorId,
            @Param("allowedEntityIds") java.util.List<UUID> allowedEntityIds,
            Pageable pageable);
}
