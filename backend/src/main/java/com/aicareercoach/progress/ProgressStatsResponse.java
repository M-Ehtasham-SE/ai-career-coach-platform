package com.aicareercoach.progress;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Aggregated progress statistics for a single user across all modules.
 * Returned by GET /api/v1/progress/stats.
 */
public record ProgressStatsResponse(

        // ── Counts ──────────────────────────────────────────────────────────
        int totalResumes,
        int totalScores,
        int totalInterviews,
        int completedInterviews,

        // ── Best Scores ──────────────────────────────────────────────────────
        Integer bestResumeScore,
        Integer bestInterviewScore,

        /**
         * Career Readiness Index: weighted composite metric (0–100).
         * Formula: 60% best resume score + 40% best interview score.
         * Null when no data is available.
         */
        Integer careerReadinessIndex,

        // ── Trend Data ───────────────────────────────────────────────────────
        /** Last 5 resume scores ordered by date descending, for trend display. */
        List<RecentScoreEntry> recentScores,

        /** Last 5 interview sessions ordered by date descending. */
        List<RecentInterviewEntry> recentInterviews,

        /** Best score achieved per job role across all resumes. */
        Map<String, Integer> bestScoresByRole,

        /** Timestamp of when these stats were computed. */
        LocalDateTime generatedAt
) {

    // ── Nested summary records ────────────────────────────────────────────────

    /**
     * A single entry in the resume score trend.
     */
    public record RecentScoreEntry(
            String jobRole,
            int overallScore,
            LocalDateTime scoredAt
    ) {}

    /**
     * A single entry in the interview history.
     */
    public record RecentInterviewEntry(
            String jobRole,
            String difficulty,
            Integer overallScore,
            boolean finalized,
            int answeredQuestions,
            int totalQuestions,
            LocalDateTime createdAt
    ) {}
}
