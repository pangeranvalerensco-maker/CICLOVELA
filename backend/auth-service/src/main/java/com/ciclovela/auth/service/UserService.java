package com.ciclovela.auth.service;

import com.ciclovela.auth.dto.request.UpdateUserStatusRequest;
import com.ciclovela.auth.dto.response.UserOptionResponse;
import com.ciclovela.auth.dto.response.UserResponse;
import com.ciclovela.auth.entity.User;
import com.ciclovela.auth.enums.UserRole;
import com.ciclovela.auth.enums.UserStatus;
import com.ciclovela.auth.exception.BadRequestException;
import com.ciclovela.auth.exception.ResourceNotFoundException;
import com.ciclovela.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(String search, UserRole role, UserStatus status, Pageable pageable) {
        boolean searchFlag = search != null && !search.trim().isEmpty();
        String safeSearch = search == null ? "" : search;
        return userRepository.findAllWithFilters(safeSearch, searchFlag, role, status, pageable)
                .map(AuthService::toUserResponse);
    }

    @Transactional(readOnly = true)
    public java.util.List<UserOptionResponse> getDirectory(UserRole role) {
        if (role != UserRole.FARMER && role != UserRole.CONSUMER) {
            throw new BadRequestException("Direktori hanya mendukung role FARMER atau CONSUMER");
        }
        return userRepository.findByRoleAndStatusOrderByNameAsc(role, UserStatus.ACTIVE).stream()
                .map(user -> UserOptionResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .toList();
    }

    @Transactional
    public UserResponse updateUserStatus(UUID id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));

        // Proteksi: Admin tidak boleh mengubah role akun menjadi PLATFORM_ADMIN
        // untuk mencegah Privilege Escalation sembarangan.
        if (request.getRole() != null && request.getRole() == UserRole.PLATFORM_ADMIN) {
            throw new BadRequestException("Tidak dapat mempromosikan pengguna menjadi Admin secara sepihak.");
        }

        user.setStatus(request.getStatus());
        
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        return AuthService.toUserResponse(userRepository.save(user));
    }
}
