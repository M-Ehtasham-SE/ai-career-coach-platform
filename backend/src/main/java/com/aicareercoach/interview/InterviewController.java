package com.aicareercoach.interview;

import com.aicareercoach.common.dto.ApiResponse;
import com.aicareercoach.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST controller for the Interview Practice module.
 *
 * <p>Base path: {@code /api/v1/interviews}
 *
 * <p>All endpoints require a valid JWT (enforced by Spring Security filter chain).
 */
@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    // ─── DTOs ────────────────────────────────────────────────────────────────

    /**
     * Request body for starting a new interview session.
     */
    public record StartSessionRequest(
            @NotBlank(message = "Job role is required")
            String jobRole,

            Difficulty difficulty  // optional; defaults to MEDIUM in service
    ) {}

    /**
     * Request body for submitting an answer.
     */
    public record SubmitAnswerRequest(
            @Min(value = 1, message = "Question index must be at least 1")
            @Max(value = 10, message = "Question index must not exceed 10")
            int questionIndex,

            @NotBlank(message = "Answer text is required")
            String userAnswer
    ) {}

    /**
     * Summary DTO for a single interview answer (used in session detail responses).
     */
    public record AnswerResponse(
            UUID id,
            int questionIndex,
            String question,
            String userAnswer,
            String aiFeedback,
            Integer score,
            LocalDateTime answeredAt
    ) {
        public static AnswerResponse of(InterviewAnswer a) {
            return new AnswerResponse(
                    a.getId(),
                    a.getQuestionIndex(),
                    a.getQuestion(),
                    a.getUserAnswer(),
                    a.getAiFeedback(),
                    a.getScore(),
                    a.getAnsweredAt()
            );
        }
    }

    /**
     * Summary DTO for a session (used in history list).
     */
    public record SessionSummaryResponse(
            UUID id,
            String jobRole,
            String difficulty,
            Integer overallScore,
            boolean finalized,
            int answeredCount,
            int totalQuestions,
            LocalDateTime createdAt,
            LocalDateTime finalizedAt
    ) {
        public static SessionSummaryResponse of(InterviewSession s) {
            long answered = s.getAnswers().stream()
                    .filter(a -> a.getUserAnswer() != null && !a.getUserAnswer().isBlank())
                    .count();
            return new SessionSummaryResponse(
                    s.getId(),
                    s.getJobRole(),
                    s.getDifficulty().name(),
                    s.getOverallScore(),
                    s.isFinalized(),
                    (int) answered,
                    s.getAnswers().size(),
                    s.getCreatedAt(),
                    s.getFinalizedAt()
            );
        }
    }

    /**
     * Full session DTO including all answers (used in detail and start responses).
     */
    public record SessionDetailResponse(
            UUID id,
            String jobRole,
            String difficulty,
            Integer overallScore,
            boolean finalized,
            LocalDateTime createdAt,
            LocalDateTime finalizedAt,
            List<AnswerResponse> answers
    ) {
        public static SessionDetailResponse of(InterviewSession s) {
            List<AnswerResponse> answerList = s.getAnswers().stream()
                    .map(AnswerResponse::of)
                    .collect(Collectors.toList());
            return new SessionDetailResponse(
                    s.getId(),
                    s.getJobRole(),
                    s.getDifficulty().name(),
                    s.getOverallScore(),
                    s.isFinalized(),
                    s.getCreatedAt(),
                    s.getFinalizedAt(),
                    answerList
            );
        }
    }

    // ─── Endpoints ───────────────────────────────────────────────────────────

    /**
     * Start a new interview session and receive AI-generated questions.
     * POST /api/v1/interviews/sessions/start
     */
    @PostMapping("/sessions/start")
    public ResponseEntity<ApiResponse<SessionDetailResponse>> startSession(
            @Valid @RequestBody StartSessionRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            InterviewSession session = interviewService.startSession(
                    currentUser.getId(),
                    request.jobRole(),
                    request.difficulty()
            );
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Interview session started successfully", SessionDetailResponse.of(session)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to start session: " + e.getMessage()));
        }
    }

    /**
     * Submit an answer for one question and receive immediate AI feedback.
     * POST /api/v1/interviews/sessions/{id}/answer
     */
    @PostMapping("/sessions/{id}/answer")
    public ResponseEntity<ApiResponse<AnswerResponse>> submitAnswer(
            @PathVariable("id") UUID sessionId,
            @Valid @RequestBody SubmitAnswerRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            InterviewAnswer answer = interviewService.submitAnswer(
                    sessionId,
                    currentUser.getId(),
                    request.questionIndex(),
                    request.userAnswer()
            );
            return ResponseEntity.ok(ApiResponse.success("Answer evaluated successfully", AnswerResponse.of(answer)));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to evaluate answer: " + e.getMessage()));
        }
    }

    /**
     * Finalize the session and compute the overall score.
     * POST /api/v1/interviews/sessions/{id}/finalize
     */
    @PostMapping("/sessions/{id}/finalize")
    public ResponseEntity<ApiResponse<SessionDetailResponse>> finalizeSession(
            @PathVariable("id") UUID sessionId,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            InterviewSession session = interviewService.finalizeSession(sessionId, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Session finalized", SessionDetailResponse.of(session)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to finalize session: " + e.getMessage()));
        }
    }

    /**
     * Get the interview session history for the authenticated user.
     * GET /api/v1/interviews/sessions
     */
    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<SessionSummaryResponse>>> getSessionHistory(
            @AuthenticationPrincipal User currentUser
    ) {
        List<SessionSummaryResponse> sessions = interviewService.getSessionHistory(currentUser.getId())
                .stream()
                .map(SessionSummaryResponse::of)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    /**
     * Get full detail of a single interview session.
     * GET /api/v1/interviews/sessions/{id}
     */
    @GetMapping("/sessions/{id}")
    public ResponseEntity<ApiResponse<SessionDetailResponse>> getSessionDetail(
            @PathVariable("id") UUID sessionId,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            InterviewSession session = interviewService.getSessionDetail(sessionId, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success(SessionDetailResponse.of(session)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        }
    }
}
