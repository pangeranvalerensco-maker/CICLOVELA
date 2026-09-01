package com.ciclovela.inventory.repository;

import com.ciclovela.inventory.entity.BusinessMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BusinessMembershipRepository extends JpaRepository<BusinessMembership, UUID> {
    
    List<BusinessMembership> findByUserId(UUID userId);
    
    List<BusinessMembership> findByBusinessEntityId(UUID businessEntityId);
    
    Optional<BusinessMembership> findByUserIdAndBusinessEntityId(UUID userId, UUID businessEntityId);
    
    boolean existsByUserIdAndBusinessEntityId(UUID userId, UUID businessEntityId);
}
