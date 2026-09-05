package com.ciclovela.auth.controller;

import com.ciclovela.auth.dto.request.UpdateUserStatusRequest;
import com.ciclovela.auth.dto.response.ApiResponse;
import com.ciclovela.auth.dto.response.UserResponse;
import com.ciclovela.auth.enums.UserRole;
import com.ciclovela.auth.enums.UserStatus;
import com.ciclovela.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<UserResponse> page = userService.getAllUsers(search, role, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data pengguna", page));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserStatusRequest request) {

        UserResponse data = userService.updateUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Status pengguna berhasil diperbarui", data));
    }
}
