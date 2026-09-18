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
            "(:searchFlag = false OR LOWER(s.transactionCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:sellerEntityId IS NULL OR s.sellerEntityId = :sellerEntityId) AND " +
            "(:buyerEntityId IS NULL OR s.buyerEntityId = :buyerEntityId) AND " +
            "(:buyerUserId IS NULL OR s.buyerUserId = :buyerUserId) AND " +
            "(:status IS NULL OR s.status = :status) AND " +
            "(:startFlag = false OR s.transactionDate >= :startDate) AND " +
            "(:endFlag = false OR s.transactionDate <= :endDate) AND " +
            "(s.buyerUserId = :actorId OR s.sellerEntityId IN :allowedEntityIds OR s.buyerEntityId IN :allowedEntityIds)")
    Page<Sale> findAllSecured(
            @Param("search") String search,
            @Param("searchFlag") boolean searchFlag,
            @Param("sellerEntityId") UUID sellerEntityId,
            @Param("buyerEntityId") UUID buyerEntityId,
            @Param("buyerUserId") UUID buyerUserId,
            @Param("status") TransactionStatus status,
            @Param("startDate") java.time.OffsetDateTime startDate,
            @Param("endDate") java.time.OffsetDateTime endDate,
            @Param("startFlag") boolean startFlag,
            @Param("endFlag") boolean endFlag,
            @Param("actorId") UUID actorId,
            @Param("allowedEntityIds") java.util.List<UUID> allowedEntityIds,
            Pageable pageable);
}
