package com.aicareercoach.score;

import com.aicareercoach.common.dto.ApiResponse;
import com.aicareercoach.user.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Endpoints for AI-powered resume scoring.
 */
@RestController
@RequestMapping("/resumes")
public class ResumeScoreController {

    private final ResumeScoreService scoreService;

    public ResumeScoreController(ResumeScoreService scoreService) {
        this.scoreService = scoreService;
    }

    /**
     * Score a resume for a given job role.
     * POST /api/v1/resumes/{id}/score?role=Software Engineer
     */
    @PostMapping("/{id}/score")
    public ResponseEntity<ApiResponse<ScoreResponse>> scoreResume(
            @PathVariable("id") UUID resumeId,
            @RequestParam(value = "role", defaultValue = "Software Engineer") String role,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            ResumeScore score = scoreService.scoreResume(resumeId, currentUser.getId(), role);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Resume scored successfully", ScoreResponse.of(score)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to score resume: " + e.getMessage()));
        }
    }

    /**
     * Get the latest score for a specific resume.
     * GET /api/v1/resumes/{id}/score
     */
    @GetMapping("/{id}/score")
    public ResponseEntity<ApiResponse<ScoreResponse>> getLatestScore(
            @PathVariable("id") UUID resumeId,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            ResumeScore score = scoreService.getLatestScore(resumeId, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success(ScoreResponse.of(score)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get all scores for a specific resume.
     * GET /api/v1/resumes/{id}/scores
     */
    @GetMapping("/{id}/scores")
    public ResponseEntity<ApiResponse<List<ScoreResponse>>> getScoresForResume(
            @PathVariable("id") UUID resumeId,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            List<ScoreResponse> scores = scoreService.getScoresForResume(resumeId, currentUser.getId())
                    .stream()
                    .map(ScoreResponse::of)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success(scores));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * DTO for score details.
     */
    public record ScoreResponse(
            UUID id,
            int overallScore,
            String strengths,
            String weaknesses,
            String suggestions,
            String jobRole,
            LocalDateTime scoredAt
    ) {
        public static ScoreResponse of(ResumeScore score) {
            return new ScoreResponse(
                    score.getId(),
                    score.getOverallScore(),
                    score.getStrengths(),
                    score.getWeaknesses(),
                    score.getSuggestions(),
                    score.getJobRole(),
                    score.getScoredAt()
            );
        }
    }
}
