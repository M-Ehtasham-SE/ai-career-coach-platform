package com.aicareercoach.auth;

import com.aicareercoach.auth.dto.AuthResponse;
import com.aicareercoach.auth.dto.RegisterRequest;
import com.aicareercoach.auth.dto.LoginRequest;
import com.aicareercoach.common.exception.UserAlreadyExistsException;
import com.aicareercoach.security.JwtService;
import com.aicareercoach.user.Role;
import com.aicareercoach.user.User;
import com.aicareercoach.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "jwtExpirationMs", 86400000L);
    }

    @Test
    void register_ShouldSaveUserAndReturnToken_WhenEmailIsUnique() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@fast.edu.pk");
        request.setPassword("Secure123");
        request.setFullName("Test User");

        User savedUser = User.builder()
                .email(request.getEmail())
                .passwordHash("hashedPassword")
                .fullName(request.getFullName())
                .role(Role.USER)
                .build();
        // Set id via reflection since it's database generated
        ReflectionTestUtils.setField(savedUser, "id", UUID.randomUUID());

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("mockJwtToken");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(86400000L, response.getExpiresIn());
        assertEquals(savedUser.getEmail(), response.getUser().getEmail());
        assertEquals(savedUser.getFullName(), response.getUser().getFullName());
        assertEquals(Role.USER, response.getUser().getRole());

        verify(userRepository).existsByEmail(request.getEmail());
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(savedUser);
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@fast.edu.pk");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@fast.edu.pk");
        request.setPassword("Secure123");

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash("hashedPassword")
                .fullName("Test User")
                .role(Role.USER)
                .build();
        ReflectionTestUtils.setField(user, "id", UUID.randomUUID());

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("mockJwtToken");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals(user.getEmail(), response.getUser().getEmail());

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        verify(userRepository).findByEmail(request.getEmail());
        verify(jwtService).generateToken(user);
    }

    @Test
    void login_ShouldThrowException_WhenCredentialsAreInvalid() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@fast.edu.pk");
        request.setPassword("wrongPassword");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(userRepository, never()).findByEmail(any());
        verify(jwtService, never()).generateToken(any(User.class));
    }
}
