package com.ciclovela.inventory.repository;

import com.ciclovela.inventory.entity.BusinessEntity;
import com.ciclovela.inventory.enums.EntityStatus;
import com.ciclovela.inventory.enums.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BusinessEntityRepository extends JpaRepository<BusinessEntity, UUID> {
    
    @Query("SELECT e FROM BusinessEntity e WHERE " +
            "(:search IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.legalName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:verificationStatus IS NULL OR e.verificationStatus = :verificationStatus) AND " +
            "(:status IS NULL OR e.status = :status)")
    Page<BusinessEntity> findAllWithFilters(
            @Param("search") String search,
            @Param("verificationStatus") VerificationStatus verificationStatus,
            @Param("status") EntityStatus status,
            Pageable pageable);
}
