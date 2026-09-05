package com.ciclovela.order.repository;

import com.ciclovela.order.entity.BusinessMembershipRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BusinessMembershipRefRepository extends JpaRepository<BusinessMembershipRef, UUID> {
    Optional<BusinessMembershipRef> findByUserIdAndBusinessEntityIdAndStatus(UUID userId, UUID businessEntityId, String status);
}
