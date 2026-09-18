package com.ciclovela.inventory.controller;

import com.ciclovela.inventory.dto.response.ApiResponse;
import com.ciclovela.inventory.dto.response.MembershipResponse;
import com.ciclovela.inventory.entity.BusinessMembership;
import com.ciclovela.inventory.repository.BusinessMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final BusinessMembershipRepository membershipRepository;
    private final com.ciclovela.inventory.repository.InventoryAccountRepository accountRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<MembershipResponse>>> getMyMemberships(
            @AuthenticationPrincipal UUID userId) {
        List<MembershipResponse> memberships = membershipRepository.findByUserId(userId).stream()
                .filter(m -> "ACTIVE".equals(m.getStatus().name()))
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil membership", memberships));
    }

    private MembershipResponse toResponse(BusinessMembership membership) {
        UUID businessAccountId = accountRepository.findByOwnerBusinessEntityId(membership.getBusinessEntity().getId())
                .map(account -> account.getId())
                .orElse(null);
        return MembershipResponse.builder()
                .id(membership.getId())
                .userId(membership.getUserId())
                .businessEntityId(membership.getBusinessEntity().getId())
                .businessAccountId(businessAccountId)
                .businessName(membership.getBusinessEntity().getName())
                .businessType(membership.getBusinessEntity().getBusinessType().name())
                .role(membership.getRole().name())
                .status(membership.getStatus().name())
                .joinedAt(membership.getJoinedAt())
                .build();
    }
}
