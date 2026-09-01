package com.ciclovela.inventory.service;

import com.ciclovela.inventory.dto.request.BusinessEntityRequest;
import com.ciclovela.inventory.dto.response.BusinessEntityResponse;
import com.ciclovela.inventory.entity.BusinessEntity;
import com.ciclovela.inventory.entity.BusinessMembership;
import com.ciclovela.inventory.entity.InventoryAccount;
import com.ciclovela.inventory.enums.EntityStatus;
import com.ciclovela.inventory.enums.MembershipRole;
import com.ciclovela.inventory.enums.MembershipStatus;
import com.ciclovela.inventory.enums.VerificationStatus;
import com.ciclovela.inventory.exception.BadRequestException;
import com.ciclovela.inventory.exception.ResourceNotFoundException;
import com.ciclovela.inventory.repository.BusinessEntityRepository;
import com.ciclovela.inventory.repository.BusinessMembershipRepository;
import com.ciclovela.inventory.repository.InventoryAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessEntityService {

    private final BusinessEntityRepository entityRepository;
    private final BusinessMembershipRepository membershipRepository;
    private final InventoryAccountRepository accountRepository;

    @Transactional(readOnly = true)
    public Page<BusinessEntityResponse> getAllEntities(String search, VerificationStatus verificationStatus, EntityStatus status, Pageable pageable) {
        return entityRepository.findAllWithFilters(search, verificationStatus, status, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public BusinessEntityResponse getEntity(UUID id) {
        return entityRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Entitas Bisnis tidak ditemukan"));
    }

    @Transactional
    public BusinessEntityResponse createRequest(BusinessEntityRequest request, UUID userId) {
        BusinessEntity entity = BusinessEntity.builder()
                .name(request.getName())
                .businessType(request.getBusinessType())
                .legalName(request.getLegalName())
                .description(request.getDescription())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .city(request.getCity())
                .province(request.getProvince())
                .postalCode(request.getPostalCode())
                .verificationDocumentUrl(request.getVerificationDocumentUrl())
                .verificationStatus(VerificationStatus.PENDING)
                .status(EntityStatus.INACTIVE)
                .createdBy(userId)
                .build();

        entity = entityRepository.save(entity);

        // Auto create membership as ENTITY_ADMIN but pending until entity is approved
        BusinessMembership membership = BusinessMembership.builder()
                .userId(userId)
                .businessEntity(entity)
                .role(MembershipRole.ENTITY_ADMIN)
                .status(MembershipStatus.PENDING)
                .build();
        
        membershipRepository.save(membership);

        return toResponse(entity);
    }

    @Transactional
    public BusinessEntityResponse approveEntity(UUID id, UUID adminId) {
        BusinessEntity entity = entityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entitas Bisnis tidak ditemukan"));

        if (entity.getVerificationStatus() == VerificationStatus.APPROVED) {
            throw new BadRequestException("Entitas sudah disetujui sebelumnya");
        }

        // Setup approval
        entity.setVerificationStatus(VerificationStatus.APPROVED);
        entity.setStatus(EntityStatus.ACTIVE);
        entity.setApprovedBy(adminId);
        entity.setApprovedAt(OffsetDateTime.now());

        // Create inventory account for this business
        InventoryAccount account = InventoryAccount.builder()
                .ownerBusinessEntity(entity)
                .build();
        accountRepository.save(account);

        // Activate pending admins
        membershipRepository.findByBusinessEntityId(id).forEach(membership -> {
            if (membership.getRole() == MembershipRole.ENTITY_ADMIN) {
                membership.setStatus(MembershipStatus.ACTIVE);
                membership.setJoinedAt(OffsetDateTime.now());
                membershipRepository.save(membership);
            }
        });

        return toResponse(entityRepository.save(entity));
    }

    private BusinessEntityResponse toResponse(BusinessEntity e) {
        return BusinessEntityResponse.builder()
                .id(e.getId())
                .name(e.getName())
                .businessType(e.getBusinessType().name())
                .legalName(e.getLegalName())
                .description(e.getDescription())
                .phone(e.getPhone())
                .email(e.getEmail())
                .address(e.getAddress())
                .city(e.getCity())
                .province(e.getProvince())
                .postalCode(e.getPostalCode())
                .verificationStatus(e.getVerificationStatus().name())
                .status(e.getStatus().name())
                .verificationDocumentUrl(e.getVerificationDocumentUrl())
                .createdBy(e.getCreatedBy())
                .approvedBy(e.getApprovedBy())
                .approvedAt(e.getApprovedAt())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
