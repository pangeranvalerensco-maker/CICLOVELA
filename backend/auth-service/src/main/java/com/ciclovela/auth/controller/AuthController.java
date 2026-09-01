package com.ciclovela.auth.controller;

import com.ciclovela.auth.dto.request.ForgotPasswordRequest;
import com.ciclovela.auth.dto.request.LoginRequest;
import com.ciclovela.auth.dto.request.RegisterRequest;
import com.ciclovela.auth.dto.request.ResetPasswordRequest;
import com.ciclovela.auth.dto.response.ApiResponse;
import com.ciclovela.auth.dto.response.AuthResponse;
import com.ciclovela.auth.dto.response.UserResponse;
import com.ciclovela.auth.entity.User;
import com.ciclovela.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse data = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registrasi berhasil", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse data = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login berhasil", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logout berhasil", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Token reset password berhasil dibuat. Gunakan token ini untuk mereset password Anda.", token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password berhasil direset", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal User user) {
        UserResponse data = authService.getProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profil berhasil dimuat", data));
    }
}
