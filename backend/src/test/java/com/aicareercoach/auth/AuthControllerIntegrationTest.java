package com.aicareercoach.auth;

import com.aicareercoach.auth.dto.LoginRequest;
import com.aicareercoach.auth.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link AuthController}.
 *
 * Tests user registration, login, and authentication validation against full Spring context and H2 database.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /auth/register - should create user and return 201 with JWT token")
    void register_ShouldCreateUserAndReturnJwtToken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("integration.user@example.com");
        request.setPassword("Password123!");
        request.setFullName("Integration Test User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("integration.user@example.com")))
                .andExpect(jsonPath("$.data.user.fullName", is("Integration Test User")));
    }

    @Test
    @DisplayName("POST /auth/login - should authenticate existing user and return 200 with token")
    void login_ShouldAuthenticateUserAndReturnToken() throws Exception {
        // Register user first
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail("login.test@example.com");
        registerReq.setPassword("Secret123!");
        registerReq.setFullName("Login User");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)));

        // Login with credentials
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("login.test@example.com");
        loginReq.setPassword("Secret123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("login.test@example.com")));
    }

    @Test
    @DisplayName("POST /auth/login - should return 400 or 401 when password is invalid")
    void login_ShouldFail_WhenPasswordIsInvalid() throws Exception {
        // Register user first
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail("wrong.pass@example.com");
        registerReq.setPassword("CorrectPassword123!");
        registerReq.setFullName("Wrong Pass User");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)));

        // Login with wrong password
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("wrong.pass@example.com");
        loginReq.setPassword("WrongPassword123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().is4xxClientError());
    }
}
