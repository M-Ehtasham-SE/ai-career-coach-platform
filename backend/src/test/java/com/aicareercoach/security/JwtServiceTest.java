package com.aicareercoach.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    // 256-bit test secret (base64 encoded)
    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000L); // 1 hour

        userDetails = new User("test@fast.edu.pk", "password", Collections.emptyList());
    }

    @Test
    void generateToken_ShouldReturnValidTokenString() {
        String token = jwtService.generateToken(userDetails);
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // Header.Payload.Signature
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        String token = jwtService.generateToken(userDetails);
        String username = jwtService.extractUsername(token);
        assertEquals("test@fast.edu.pk", username);
    }

    @Test
    void isTokenValid_ShouldReturnTrue_WhenTokenIsValid() {
        String token = jwtService.generateToken(userDetails);
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        assertTrue(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenUsernameDiffers() {
        String token = jwtService.generateToken(userDetails);
        UserDetails otherUser = new User("other@fast.edu.pk", "password", Collections.emptyList());
        boolean isValid = jwtService.isTokenValid(token, otherUser);
        assertFalse(isValid);
    }
}
