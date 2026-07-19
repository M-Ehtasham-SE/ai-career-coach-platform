package com.aicareercoach.score;

import com.aicareercoach.ai.OpenAiService;
import com.aicareercoach.resume.Resume;
import com.aicareercoach.resume.ResumeRepository;
import com.aicareercoach.user.Role;
import com.aicareercoach.user.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ResumeScoreService.
 * Uses Mockito to isolate the service from the database and OpenAI API.
 */
@ExtendWith(MockitoExtension.class)
class ResumeScoreServiceTest {

    @Mock
    private ResumeScoreRepository scoreRepository;

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private OpenAiService openAiService;

    @InjectMocks
    private ResumeScoreService scoreService;

    private User owner;
    private UUID ownerId;
    private Resume resume;
    private UUID resumeId;

    private static final String SAMPLE_RESUME_TEXT = "Experienced Java developer with Spring Boot, REST APIs, and PostgreSQL skills.";

    @BeforeEach
    void setUp() throws Exception {
        // Build the resume owner
        ownerId = UUID.randomUUID();
        owner = User.builder()
                .email("student@fast.edu.pk")
                .fullName("Muhammad Ehtasham")
                .role(Role.USER)
                .build();
        ReflectionTestUtils.setField(owner, "id", ownerId);

        // Build a sample resume
        resumeId = UUID.randomUUID();
        resume = new Resume("ehtasham_resume.pdf", "uploads/resumes/ehtasham_resume.pdf", SAMPLE_RESUME_TEXT, owner);
        ReflectionTestUtils.setField(resume, "id", resumeId);
        resume.setActive(true);
    }

    // ─── Helper: build a mock AI JSON response ───────────────────────────────

    private JsonNode buildMockAiResponse() throws Exception {
        String mockJson = """
            {
                "overallScore": 78,
                "strengths": ["Strong backend skills", "Good project experience", "Clear formatting", "Relevant certifications", "Good use of action verbs"],
                "weaknesses": ["Missing quantifiable metrics", "No portfolio link", "Short summary", "No open-source contributions", "Missing keywords for ATS"],
                "suggestions": ["Add metrics to achievements", "Link your GitHub profile", "Expand professional summary", "List open-source projects", "Include ATS keywords"]
            }
            """;
        return new ObjectMapper().readTree(mockJson);
    }

    // ─── scoreResume ─────────────────────────────────────────────────────────

    @Test
    void scoreResume_ShouldAnalyzeAndPersistScore_WhenInputIsValid() throws Exception {
        // Arrange
        JsonNode aiResponse = buildMockAiResponse();
        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(resume));
        when(openAiService.analyzeWithJson(anyString(), anyString())).thenReturn(aiResponse);

        ResumeScore persistedScore = new ResumeScore();
        ReflectionTestUtils.setField(persistedScore, "id", UUID.randomUUID());
        persistedScore.setResume(resume);
        persistedScore.setJobRole("Software Engineer");
        persistedScore.setOverallScore(78);
        persistedScore.setScoredAt(LocalDateTime.now());
        when(scoreRepository.save(any(ResumeScore.class))).thenReturn(persistedScore);

        // Act
        ResumeScore result = scoreService.scoreResume(resumeId, ownerId, "Software Engineer");

        // Assert
        assertNotNull(result);
        assertEquals(78, result.getOverallScore());
        assertEquals("Software Engineer", result.getJobRole());
        assertNotNull(result.getResume());

        verify(resumeRepository).findById(resumeId);
        verify(openAiService).analyzeWithJson(anyString(), anyString());
        verify(scoreRepository).save(any(ResumeScore.class));
    }

    @Test
    void scoreResume_ShouldDefaultToSoftwareEngineer_WhenRoleIsBlank() throws Exception {
        // Arrange
        JsonNode aiResponse = buildMockAiResponse();
        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(resume));
        when(openAiService.analyzeWithJson(anyString(), anyString())).thenReturn(aiResponse);

        ResumeScore persistedScore = new ResumeScore();
        persistedScore.setResume(resume);
        persistedScore.setJobRole("Software Engineer");
        persistedScore.setOverallScore(78);
        when(scoreRepository.save(any(ResumeScore.class))).thenAnswer(inv -> {
            ResumeScore s = inv.getArgument(0);
            assertEquals("Software Engineer", s.getJobRole(), "Default role should be 'Software Engineer'");
            return s;
        });

        // Act
        ResumeScore result = scoreService.scoreResume(resumeId, ownerId, "   ");

        // Assert
        assertNotNull(result);
        verify(scoreRepository).save(any(ResumeScore.class));
    }

    @Test
    void scoreResume_ShouldThrowIllegalArgumentException_WhenResumeNotFound() {
        // Arrange
        when(resumeRepository.findById(resumeId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> scoreService.scoreResume(resumeId, ownerId, "Backend Developer"));

        verify(scoreRepository, never()).save(any());
        verify(openAiService, never()).analyzeWithJson(any(), any());
    }

    @Test
    void scoreResume_ShouldThrowSecurityException_WhenUserDoesNotOwnResume() {
        // Arrange
        UUID differentUserId = UUID.randomUUID();
        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(resume));

        // Act & Assert
        assertThrows(SecurityException.class,
                () -> scoreService.scoreResume(resumeId, differentUserId, "Data Scientist"));

        verify(openAiService, never()).analyzeWithJson(any(), any());
        verify(scoreRepository, never()).save(any());
    }

    @Test
    void scoreResume_ShouldThrowIllegalStateException_WhenResumeHasNoRawText() {
        // Arrange
        Resume emptyResume = new Resume("empty.pdf", "uploads/empty.pdf", null, owner);
        ReflectionTestUtils.setField(emptyResume, "id", resumeId);

        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(emptyResume));

        // Act & Assert
        assertThrows(IllegalStateException.class,
                () -> scoreService.scoreResume(resumeId, ownerId, "Frontend Developer"));

        verify(openAiService, never()).analyzeWithJson(any(), any());
        verify(scoreRepository, never()).save(any());
    }

    // ─── getLatestScore ──────────────────────────────────────────────────────

    @Test
    void getLatestScore_ShouldReturnScore_WhenUserOwnsResume() {
        // Arrange
        ResumeScore score = new ResumeScore();
        score.setResume(resume);
        score.setOverallScore(72);
        score.setJobRole("DevOps Engineer");
        score.setScoredAt(LocalDateTime.now());

        when(scoreRepository.findFirstByResumeIdOrderByScoredAtDesc(resumeId))
                .thenReturn(Optional.of(score));

        // Act
        ResumeScore result = scoreService.getLatestScore(resumeId, ownerId);

        // Assert
        assertNotNull(result);
        assertEquals(72, result.getOverallScore());
        assertEquals("DevOps Engineer", result.getJobRole());
        verify(scoreRepository).findFirstByResumeIdOrderByScoredAtDesc(resumeId);
    }

    @Test
    void getLatestScore_ShouldThrowSecurityException_WhenUserDoesNotOwnResume() {
        // Arrange
        UUID attackerId = UUID.randomUUID();
        ResumeScore score = new ResumeScore();
        score.setResume(resume); // resume belongs to 'owner', not 'attacker'

        when(scoreRepository.findFirstByResumeIdOrderByScoredAtDesc(resumeId))
                .thenReturn(Optional.of(score));

        // Act & Assert
        assertThrows(SecurityException.class,
                () -> scoreService.getLatestScore(resumeId, attackerId));
    }

    // ─── getAllScoresForUser ──────────────────────────────────────────────────

    @Test
    void getAllScoresForUser_ShouldDelegateToRepository() {
        // Arrange
        ResumeScore score1 = new ResumeScore();
        score1.setOverallScore(80);
        ResumeScore score2 = new ResumeScore();
        score2.setOverallScore(65);

        when(scoreRepository.findByResumeUserIdOrderByScoredAtDesc(ownerId))
                .thenReturn(List.of(score1, score2));

        // Act
        List<ResumeScore> results = scoreService.getAllScoresForUser(ownerId);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals(80, results.get(0).getOverallScore());
        verify(scoreRepository).findByResumeUserIdOrderByScoredAtDesc(ownerId);
    }

    // ─── getBestScoresPerRole ────────────────────────────────────────────────

    @Test
    void getBestScoresPerRole_ShouldReturnHighestScorePerRole() {
        // Arrange — two roles, multiple scores each
        ResumeScore se1 = new ResumeScore();
        se1.setJobRole("Software Engineer");
        se1.setOverallScore(72);

        ResumeScore se2 = new ResumeScore();
        se2.setJobRole("Software Engineer");
        se2.setOverallScore(85);

        ResumeScore fe1 = new ResumeScore();
        fe1.setJobRole("Frontend Developer");
        fe1.setOverallScore(60);

        ResumeScore fe2 = new ResumeScore();
        fe2.setJobRole("Frontend Developer");
        fe2.setOverallScore(68);

        when(scoreRepository.findByResumeUserIdOrderByScoredAtDesc(ownerId))
                .thenReturn(List.of(se1, se2, fe1, fe2));

        // Act
        Map<String, Integer> result = scoreService.getBestScoresPerRole(ownerId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(85, result.get("Software Engineer"));
        assertEquals(68, result.get("Frontend Developer"));

        // Verify sorted descending by value — Software Engineer (85) should come first
        String firstKey = result.keySet().iterator().next();
        assertEquals("Software Engineer", firstKey);
    }

    @Test
    void getBestScoresPerRole_ShouldReturnEmptyMap_WhenNoScoresExist() {
        // Arrange
        when(scoreRepository.findByResumeUserIdOrderByScoredAtDesc(ownerId))
                .thenReturn(List.of());

        // Act
        Map<String, Integer> result = scoreService.getBestScoresPerRole(ownerId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getBestScoresPerRole_ShouldHandleSingleRole() {
        // Arrange
        ResumeScore score = new ResumeScore();
        score.setJobRole("Data Scientist");
        score.setOverallScore(90);

        when(scoreRepository.findByResumeUserIdOrderByScoredAtDesc(ownerId))
                .thenReturn(List.of(score));

        // Act
        Map<String, Integer> result = scoreService.getBestScoresPerRole(ownerId);

        // Assert
        assertEquals(1, result.size());
        assertEquals(90, result.get("Data Scientist"));
    }
}
