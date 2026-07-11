package com.aicareercoach.auth;

import com.aicareercoach.auth.dto.AuthResponse;
import com.aicareercoach.auth.dto.LoginRequest;
import com.aicareercoach.auth.dto.RegisterRequest;
import com.aicareercoach.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller.
 * Endpoints as defined in docs/10-api-plan.md:
 *   POST /auth/register  — public
 *   POST /auth/login     — public
 *   POST /auth/logout    — stateless (client removes token)
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // Stateless JWT: logout is handled client-side by removing the token.
        // Future: implement token blacklisting for enhanced security.
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
