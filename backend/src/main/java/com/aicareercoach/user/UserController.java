package com.aicareercoach.user;

import com.aicareercoach.common.dto.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User profile controller.
 * Endpoints:
 *   GET  /users/me          — returns the authenticated user's profile
 *   PUT  /users/me          — update full name / email
 *   PUT  /users/me/password — change password
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
            @AuthenticationPrincipal User currentUser
    ) {
        UserProfileResponse profile = UserProfileResponse.of(currentUser);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        // Check if new email is already taken by another user
        if (request.email() != null && !request.email().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email is already taken by another account."));
            }
            currentUser.setEmail(request.email());
        }

        if (request.fullName() != null && !request.fullName().isBlank()) {
            currentUser.setFullName(request.fullName());
        }

        User saved = userRepository.save(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", UserProfileResponse.of(saved)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        // Validate old password
        if (!passwordEncoder.matches(request.oldPassword(), currentUser.getPasswordHash())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Current password is incorrect."));
        }

        // Validate new password differs from old
        if (request.oldPassword().equals(request.newPassword())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("New password must be different from the current one."));
        }

        currentUser.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    // ============================================
    // DTOs
    // ============================================

    public record UserProfileResponse(
            UUID id,
            String email,
            String fullName,
            Role role,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static UserProfileResponse of(User user) {
            return new UserProfileResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole(),
                    user.getCreatedAt(),
                    user.getUpdatedAt()
            );
        }
    }

    public record UpdateProfileRequest(
            @Size(max = 100, message = "Full name must not exceed 100 characters")
            String fullName,

            @Email(message = "Invalid email format")
            String email
    ) {}

    public record ChangePasswordRequest(
            @NotBlank(message = "Current password is required")
            String oldPassword,

            @NotBlank(message = "New password is required")
            @Size(min = 8, message = "New password must be at least 8 characters")
            String newPassword
    ) {}
}
