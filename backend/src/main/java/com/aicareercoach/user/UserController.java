package com.aicareercoach.user;

import com.aicareercoach.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User profile controller.
 * Endpoint: GET /users/me — returns the authenticated user's profile.
 * Additional endpoints (PUT /users/me, PUT /users/me/password) will be added in Week 3.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
            @AuthenticationPrincipal User currentUser
    ) {
        UserProfileResponse profile = UserProfileResponse.of(currentUser);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * Response DTO for the /users/me endpoint.
     * Does NOT expose passwordHash.
     */
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
}
