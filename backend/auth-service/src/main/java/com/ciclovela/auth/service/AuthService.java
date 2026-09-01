package com.ciclovela.auth.service;

import com.ciclovela.auth.dto.request.ForgotPasswordRequest;
import com.ciclovela.auth.dto.request.LoginRequest;
import com.ciclovela.auth.dto.request.RegisterRequest;
import com.ciclovela.auth.dto.request.ResetPasswordRequest;
import com.ciclovela.auth.dto.response.AuthResponse;
import com.ciclovela.auth.dto.response.UserResponse;
import com.ciclovela.auth.entity.User;
import com.ciclovela.auth.enums.UserRole;
import com.ciclovela.auth.enums.UserStatus;
import com.ciclovela.auth.exception.BadRequestException;
import com.ciclovela.auth.exception.DuplicateResourceException;
import com.ciclovela.auth.exception.ResourceNotFoundException;
import com.ciclovela.auth.exception.UnauthorizedException;
import com.ciclovela.auth.repository.UserRepository;
import com.ciclovela.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final Map<String, UUID> resetTokenStore = new ConcurrentHashMap<>();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirmation())) {
            throw new BadRequestException("Password dan konfirmasi password tidak sama");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email sudah terdaftar");
        }

        UserRole role = UserRole.CONSUMER;
        if (request.getRole() != null) {
            try {
                role = UserRole.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Role tidak valid. Pilihan: FARMER, CONSUMER");
            }
            if (role == UserRole.PLATFORM_ADMIN) {
                throw new BadRequestException("Tidak dapat mendaftar sebagai Platform Admin");
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Email atau password salah"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Email atau password salah");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Akun Anda telah dinonaktifkan");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new UnauthorizedException("Akun Anda tidak aktif");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Email tidak ditemukan"));

        String resetToken = UUID.randomUUID().toString();
        resetTokenStore.put(resetToken, user.getId());

        return resetToken;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirmation())) {
            throw new BadRequestException("Password dan konfirmasi password tidak sama");
        }

        UUID userId = resetTokenStore.get(request.getToken());
        if (userId == null) {
            throw new BadRequestException("Token reset password tidak valid atau sudah kedaluwarsa");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        resetTokenStore.remove(request.getToken());
    }

    public UserResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));

        return toUserResponse(user);
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .city(user.getCity())
                .province(user.getProvince())
                .postalCode(user.getPostalCode())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
