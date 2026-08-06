package com.aicareercoach.interview;

import com.aicareercoach.ai.OpenAiService;
import com.aicareercoach.user.User;
import com.aicareercoach.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link InterviewService}.
 *
 * Uses Mockito to isolate business logic from database and AI dependencies.
 */
@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OpenAiService openAiService;

    @InjectMocks
    private InterviewService interviewService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private UUID userId;
    private UUID sessionId;
    private User testUser;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        sessionId = UUID.randomUUID();

        testUser = new User();
        testUser.setId(userId);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
    }

    // ─── startSession tests ───────────────────────────────────────────────────

    @Test
    @DisplayName("startSession: should create session with AI-generated questions")
    void startSession_ShouldCreateSessionAndReturnQuestions() throws Exception {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        InterviewSession savedSession = new InterviewSession("Software Engineer", Difficulty.MEDIUM, testUser);
        savedSession.setId(sessionId);
        when(sessionRepository.save(any(InterviewSession.class))).thenReturn(savedSession);

        // Mock AI returning 5 questions
        ObjectNode aiResponse = objectMapper.createObjectNode();
        var questionsArray = aiResponse.putArray("questions");
        questionsArray.add("What is polymorphism?");
        questionsArray.add("Explain SOLID principles.");
        questionsArray.add("What is the difference between == and equals() in Java?");
        questionsArray.add("Describe a design pattern you have used.");
        questionsArray.add("How does garbage collection work in Java?");
        when(openAiService.analyzeWithJson(anyString(), anyString())).thenReturn(aiResponse);

        when(answerRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        // Act
        InterviewSession result = interviewService.startSession(userId, "Software Engineer", Difficulty.MEDIUM);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getJobRole()).isEqualTo("Software Engineer");
        assertThat(result.getDifficulty()).isEqualTo(Difficulty.MEDIUM);
        verify(sessionRepository).save(any(InterviewSession.class));
        verify(answerRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("startSession: should default to MEDIUM difficulty when null is passed")
    void startSession_ShouldDefaultToMediumDifficulty_WhenNullPassed() throws Exception {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        InterviewSession savedSession = new InterviewSession("Frontend Developer", Difficulty.MEDIUM, testUser);
        savedSession.setId(sessionId);
        when(sessionRepository.save(any(InterviewSession.class))).thenReturn(savedSession);

        ObjectNode aiResponse = objectMapper.createObjectNode();
        var questionsArray = aiResponse.putArray("questions");
        for (int i = 1; i <= 5; i++) questionsArray.add("Question " + i);
        when(openAiService.analyzeWithJson(anyString(), anyString())).thenReturn(aiResponse);
        when(answerRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        // Act — pass null difficulty
        InterviewSession result = interviewService.startSession(userId, "Frontend Developer", null);

        // Assert
        assertThat(result.getDifficulty()).isEqualTo(Difficulty.MEDIUM);
    }

    @Test
    @DisplayName("startSession: should use fallback questions when AI is unavailable")
    void startSession_ShouldUseFallbackQuestions_WhenAiFails() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        InterviewSession savedSession = new InterviewSession("DevOps Engineer", Difficulty.HARD, testUser);
        savedSession.setId(sessionId);
        when(sessionRepository.save(any(InterviewSession.class))).thenReturn(savedSession);

        // AI throws an exception
        when(openAiService.analyzeWithJson(anyString(), anyString()))
                .thenThrow(new RuntimeException("AI service unavailable"));
        when(answerRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        // Act — should not throw; fallback questions are used
        assertThatCode(() -> interviewService.startSession(userId, "DevOps Engineer", Difficulty.HARD))
                .doesNotThrowAnyException();
    }

    // ─── submitAnswer tests ───────────────────────────────────────────────────

    @Test
    @DisplayName("submitAnswer: should persist AI feedback and score for a valid answer")
    void submitAnswer_ShouldPersistFeedbackAndScore() throws Exception {
        // Arrange
        InterviewSession session = new InterviewSession("Backend Developer", Difficulty.MEDIUM, testUser);
        session.setId(sessionId);

        InterviewAnswer placeholder = new InterviewAnswer("What is REST?", 1, session);
        placeholder.setId(UUID.randomUUID());
        session.getAnswers().add(placeholder);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // Mock AI evaluation
        ObjectNode evalResponse = objectMapper.createObjectNode();
        evalResponse.put("score", 8);
        evalResponse.put("feedback", "Good explanation of REST principles.");
        when(openAiService.analyzeWithJson(anyString(), anyString())).thenReturn(evalResponse);

        when(answerRepository.save(any(InterviewAnswer.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        InterviewAnswer result = interviewService.submitAnswer(sessionId, userId, 1, "REST is an architectural style...");

        // Assert
        assertThat(result.getScore()).isEqualTo(8);
        assertThat(result.getAiFeedback()).isEqualTo("Good explanation of REST principles.");
        assertThat(result.getUserAnswer()).isEqualTo("REST is an architectural style...");
        assertThat(result.getAnsweredAt()).isNotNull();
    }

    @Test
    @DisplayName("submitAnswer: should reject access when user does not own the session")
    void submitAnswer_ShouldThrowSecurityException_WhenUserNotOwner() {
        // Arrange — session belongs to a different user
        User anotherUser = new User();
        anotherUser.setId(UUID.randomUUID());

        InterviewSession session = new InterviewSession("Data Scientist", Difficulty.EASY, anotherUser);
        session.setId(sessionId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // Act & Assert
        assertThatThrownBy(() -> interviewService.submitAnswer(sessionId, userId, 1, "My answer"))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("permission");
    }

    @Test
    @DisplayName("submitAnswer: should throw IllegalStateException when session is already finalized")
    void submitAnswer_ShouldThrowIllegalStateException_WhenSessionIsFinalized() {
        // Arrange
        InterviewSession session = new InterviewSession("Product Manager", Difficulty.MEDIUM, testUser);
        session.setId(sessionId);
        session.setFinalized(true);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // Act & Assert
        assertThatThrownBy(() -> interviewService.submitAnswer(sessionId, userId, 1, "My answer"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("finalized");
    }

    // ─── finalizeSession tests ────────────────────────────────────────────────

    @Test
    @DisplayName("finalizeSession: should compute overall score as scaled average of answer scores")
    void finalizeSession_ShouldCalculateCorrectOverallScore() {
        // Arrange — 3 answers with scores 6, 8, 10 → avg = 8.0 → overallScore = 80
        InterviewSession session = new InterviewSession("Full Stack Developer", Difficulty.MEDIUM, testUser);
        session.setId(sessionId);

        InterviewAnswer a1 = new InterviewAnswer("Q1", 1, session); a1.setScore(6);
        InterviewAnswer a2 = new InterviewAnswer("Q2", 2, session); a2.setScore(8);
        InterviewAnswer a3 = new InterviewAnswer("Q3", 3, session); a3.setScore(10);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(answerRepository.findBySessionIdOrderByAnsweredAtAsc(sessionId))
                .thenReturn(Arrays.asList(a1, a2, a3));
        when(sessionRepository.save(any(InterviewSession.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        InterviewSession result = interviewService.finalizeSession(sessionId, userId);

        // Assert
        assertThat(result.isFinalized()).isTrue();
        assertThat(result.getOverallScore()).isEqualTo(80);
        assertThat(result.getFinalizedAt()).isNotNull();
    }

    // ─── getSessionHistory tests ──────────────────────────────────────────────

    @Test
    @DisplayName("getSessionHistory: should return empty list when no sessions exist")
    void getSessionHistory_ShouldReturnEmptyList_WhenNoSessionsExist() {
        // Arrange
        when(sessionRepository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Collections.emptyList());

        // Act
        List<InterviewSession> result = interviewService.getSessionHistory(userId);

        // Assert
        assertThat(result).isEmpty();
    }
}
