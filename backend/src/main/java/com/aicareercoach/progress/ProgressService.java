package com.aicareercoach.progress;

import com.aicareercoach.interview.InterviewSession;
import com.aicareercoach.interview.InterviewSessionRepository;
import com.aicareercoach.resume.ResumeRepository;
import com.aicareercoach.score.ResumeScore;
import com.aicareercoach.score.ResumeScoreRepository;
import com.aicareercoach.score.ResumeScoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service that aggregates career progress statistics for a user
 * across all platform modules: resumes, scores, and interviews.
 */
@Service
public class ProgressService {

    private static final Logger log = LoggerFactory.getLogger(ProgressService.class);

    private static final int RECENT_ITEMS_LIMIT = 5;

    private final ResumeRepository resumeRepository;
    private final ResumeScoreRepository scoreRepository;
    private final InterviewSessionRepository sessionRepository;
    private final ResumeScoreService resumeScoreService;

    public ProgressService(
            ResumeRepository resumeRepository,
            ResumeScoreRepository scoreRepository,
            InterviewSessionRepository sessionRepository,
            ResumeScoreService resumeScoreService
    ) {
        this.resumeRepository = resumeRepository;
        this.scoreRepository = scoreRepository;
        this.sessionRepository = sessionRepository;
        this.resumeScoreService = resumeScoreService;
    }

    /**
     * Computes and returns the full progress stats for a user.
     * Aggregates data from resumes, resume scores, and interview sessions.
     *
     * @param userId the authenticated user's ID
     * @return a fully populated {@link ProgressStatsResponse}
     */
    @Transactional(readOnly = true)
    public ProgressStatsResponse getUserStats(UUID userId) {
        log.debug("Computing progress stats for user {}", userId);

        // ── Counts ────────────────────────────────────────────────────────────
        int totalResumes = (int) resumeRepository.countByUserId(userId);
        List<ResumeScore> allScores = scoreRepository.findByResumeUserIdOrderByScoredAtDesc(userId);
        int totalScores = allScores.size();

        List<InterviewSession> allSessions = sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        int totalInterviews = allSessions.size();
        int completedInterviews = (int) allSessions.stream().filter(InterviewSession::isFinalized).count();

        // ── Best Scores ───────────────────────────────────────────────────────
        Integer bestResumeScore = allScores.stream()
                .mapToInt(ResumeScore::getOverallScore)
                .max()
                .stream()
                .boxed()
                .findFirst()
                .orElse(null);

        Integer bestInterviewScore = allSessions.stream()
                .filter(s -> s.getOverallScore() != null)
                .mapToInt(InterviewSession::getOverallScore)
                .max()
                .stream()
                .boxed()
                .findFirst()
                .orElse(null);

        // ── Career Readiness Index ─────────────────────────────────────────────
        // 60% weight on best resume score, 40% weight on best interview score.
        // If only one type of data exists, use 100% weight for the available type.
        Integer careerReadinessIndex = computeCareerReadinessIndex(bestResumeScore, bestInterviewScore);

        // ── Recent Score Trend ────────────────────────────────────────────────
        List<ProgressStatsResponse.RecentScoreEntry> recentScores = allScores.stream()
                .limit(RECENT_ITEMS_LIMIT)
                .map(s -> new ProgressStatsResponse.RecentScoreEntry(
                        s.getJobRole(),
                        s.getOverallScore(),
                        s.getScoredAt()
                ))
                .collect(Collectors.toList());

        // ── Recent Interview History ───────────────────────────────────────────
        List<ProgressStatsResponse.RecentInterviewEntry> recentInterviews = allSessions.stream()
                .limit(RECENT_ITEMS_LIMIT)
                .map(s -> {
                    long answered = s.getAnswers().stream()
                            .filter(a -> a.getUserAnswer() != null && !a.getUserAnswer().isBlank())
                            .count();
                    return new ProgressStatsResponse.RecentInterviewEntry(
                            s.getJobRole(),
                            s.getDifficulty().name(),
                            s.getOverallScore(),
                            s.isFinalized(),
                            (int) answered,
                            s.getAnswers().size(),
                            s.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());

        // ── Best Scores Per Role ──────────────────────────────────────────────
        Map<String, Integer> bestScoresByRole = resumeScoreService.getBestScoresPerRole(userId);

        log.debug("Progress stats computed for user {}: {} resumes, {} scores, {} interviews",
                userId, totalResumes, totalScores, totalInterviews);

        return new ProgressStatsResponse(
                totalResumes,
                totalScores,
                totalInterviews,
                completedInterviews,
                bestResumeScore,
                bestInterviewScore,
                careerReadinessIndex,
                recentScores,
                recentInterviews,
                bestScoresByRole,
                LocalDateTime.now()
        );
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    /**
     * Weighted composite: 60% resume score + 40% interview score.
     * Falls back to available data only if one type is missing.
     */
    private Integer computeCareerReadinessIndex(Integer bestResume, Integer bestInterview) {
        if (bestResume == null && bestInterview == null) return null;
        if (bestResume == null)   return bestInterview;
        if (bestInterview == null) return bestResume;
        return (int) Math.round(bestResume * 0.6 + bestInterview * 0.4);
    }
}
