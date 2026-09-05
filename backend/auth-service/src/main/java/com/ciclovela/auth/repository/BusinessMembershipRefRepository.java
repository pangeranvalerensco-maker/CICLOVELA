package com.ciclovela.auth.repository;

import com.ciclovela.auth.entity.BusinessMembershipRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BusinessMembershipRefRepository extends JpaRepository<BusinessMembershipRef, UUID> {
    List<BusinessMembershipRef> findByUserIdAndStatus(UUID userId, String status);
}
