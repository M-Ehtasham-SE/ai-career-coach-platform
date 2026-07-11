package com.aicareercoach.auth.dto;

import com.aicareercoach.user.Role;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for successful authentication (register or login).
 * Matches the API specification in docs/10-api-plan.md.
 *
 * Contains JWT token + user summary — never exposes password hash.
 */
public class AuthResponse {

    private String token;
    private String tokenType;
    private long expiresIn;
    private UserSummary user;

    private AuthResponse() {
    }

    public static AuthResponse of(String token, long expiresIn, UserSummary user) {
        AuthResponse response = new AuthResponse();
        response.token = token;
        response.tokenType = "Bearer";
        response.expiresIn = expiresIn;
        response.user = user;
        return response;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public UserSummary getUser() {
        return user;
    }

    /**
     * Nested DTO — user summary embedded in auth response.
     * Does NOT include passwordHash.
     */
    public static class UserSummary {
        private UUID id;
        private String email;
        private String fullName;
        private Role role;
        private LocalDateTime createdAt;

        public static UserSummary of(UUID id, String email, String fullName, Role role, LocalDateTime createdAt) {
            UserSummary summary = new UserSummary();
            summary.id = id;
            summary.email = email;
            summary.fullName = fullName;
            summary.role = role;
            summary.createdAt = createdAt;
            return summary;
        }

        public UUID getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFullName() {
            return fullName;
        }

        public Role getRole() {
            return role;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }
}
