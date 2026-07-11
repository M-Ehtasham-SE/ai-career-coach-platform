package com.aicareercoach.auth;

import com.aicareercoach.auth.dto.AuthResponse;
import com.aicareercoach.auth.dto.LoginRequest;
import com.aicareercoach.auth.dto.RegisterRequest;
import com.aicareercoach.common.exception.UserAlreadyExistsException;
import com.aicareercoach.security.JwtService;
import com.aicareercoach.user.User;
import com.aicareercoach.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling user registration and login.
 *
 * Single Responsibility: authentication business logic only.
 * All token operations delegate to JwtService.
 * All password hashing delegates to PasswordEncoder.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.security.jwt-expiration}")
    private long jwtExpirationMs;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registers a new user.
     * Validates email uniqueness, hashes password, persists user, returns JWT.
     *
     * @param request validated registration payload
     * @return AuthResponse with JWT and user summary
     * @throws UserAlreadyExistsException if email is already registered
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return buildAuthResponse(token, savedUser);
    }

    /**
     * Authenticates an existing user.
     * Delegates credential validation to AuthenticationManager (uses BCrypt internally).
     *
     * @param request login credentials
     * @return AuthResponse with JWT and user summary
     * @throws org.springframework.security.authentication.BadCredentialsException if credentials are wrong
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtService.generateToken(user);
        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse.UserSummary userSummary = AuthResponse.UserSummary.of(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt()
        );
        return AuthResponse.of(token, jwtExpirationMs, userSummary);
    }
}
