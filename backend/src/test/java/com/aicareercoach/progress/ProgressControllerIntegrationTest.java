package com.aicareercoach.progress;

import com.aicareercoach.auth.dto.AuthResponse;
import com.aicareercoach.auth.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link ProgressController}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProgressControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /progress/stats - should reject unauthenticated request with 403 or 401")
    void getProgressStats_ShouldRejectUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/progress/stats"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("GET /progress/stats - should return stats for authenticated user")
    void getProgressStats_ShouldReturnUserStats_WhenAuthenticated() throws Exception {
        // Register user to obtain JWT
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail("progress.test@example.com");
        registerReq.setPassword("Password123!");
        registerReq.setFullName("Progress User");

        MvcResult result = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("data").get("token").asText();

        // Perform request with JWT
        mockMvc.perform(get("/progress/stats")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.totalResumes", is(0)))
                .andExpect(jsonPath("$.data.totalScores", is(0)))
                .andExpect(jsonPath("$.data.totalInterviews", is(0)));
    }
}
