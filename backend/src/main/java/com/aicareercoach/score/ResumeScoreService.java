package com.aicareercoach.score;

import com.aicareercoach.ai.OpenAiService;
import com.aicareercoach.resume.Resume;
import com.aicareercoach.resume.ResumeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

@Service
public class ResumeScoreService {

    private static final Logger log = LoggerFactory.getLogger(ResumeScoreService.class);

    private final ResumeScoreRepository scoreRepository;
    private final ResumeRepository resumeRepository;
    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
        You are an expert resume reviewer and career coach. You analyze resumes and provide 
        detailed, actionable feedback. Always respond in valid JSON format with exactly these fields:
        {
            "overallScore": <integer 0-100>,
            "strengths": [<array of 5 strings>],
            "weaknesses": [<array of 5 strings>],
            "suggestions": [<array of 5 strings>]
        }
        Be specific, professional, and constructive in your feedback.
        """;

    public ResumeScoreService(
            ResumeScoreRepository scoreRepository,
            ResumeRepository resumeRepository,
            OpenAiService openAiService
    ) {
        this.scoreRepository = scoreRepository;
        this.resumeRepository = resumeRepository;
        this.openAiService = openAiService;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Scores a resume using AI for the given job role.
     */
    @Transactional
    public ResumeScore scoreResume(UUID resumeId, UUID userId, String jobRole) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found."));

        if (!resume.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to score this resume.");
        }

        String rawText = resume.getRawText();
        if (rawText == null || rawText.isBlank()) {
            throw new IllegalStateException("Resume has no extracted text to analyze.");
        }

        // Build the user prompt
        String role = (jobRole != null && !jobRole.isBlank()) ? jobRole : "Software Engineer";
        String userPrompt = String.format(
                "Analyze this resume for a %s position.\n\nResume:\n%s",
                role,
                rawText.length() > 8000 ? rawText.substring(0, 8000) : rawText
        );

        // Call AI
        JsonNode aiResponse = openAiService.analyzeWithJson(SYSTEM_PROMPT, userPrompt);

        // Parse and persist
        ResumeScore score = new ResumeScore();
        score.setResume(resume);
        score.setJobRole(role);
        score.setOverallScore(aiResponse.path("overallScore").asInt(50));
        score.setScoredAt(LocalDateTime.now());

        try {
            score.setStrengths(objectMapper.writeValueAsString(aiResponse.path("strengths")));
            score.setWeaknesses(objectMapper.writeValueAsString(aiResponse.path("weaknesses")));
            score.setSuggestions(objectMapper.writeValueAsString(aiResponse.path("suggestions")));
        } catch (Exception e) {
            log.error("Failed to serialize AI response fields", e);
            score.setStrengths("[]");
            score.setWeaknesses("[]");
            score.setSuggestions("[]");
        }

        return scoreRepository.save(score);
    }

    /**
     * Gets the latest score for a specific resume.
     */
    public ResumeScore getLatestScore(UUID resumeId, UUID userId) {
        ResumeScore score = scoreRepository.findFirstByResumeIdOrderByScoredAtDesc(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("No score found for this resume."));

        if (!score.getResume().getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to view this score.");
        }

        return score;
    }

    /**
     * Gets all scores for the current user across all resumes.
     */
    public List<ResumeScore> getAllScoresForUser(UUID userId) {
        return scoreRepository.findByResumeUserIdOrderByScoredAtDesc(userId);
    }

    /**
     * Gets all scores for a specific resume.
     */
    public List<ResumeScore> getScoresForResume(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found."));

        if (!resume.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to view these scores.");
        }

        return scoreRepository.findByResumeIdOrderByScoredAtDesc(resumeId);
    }

    /**
     * Returns the highest score achieved by the user for each job role.
     * E.g., { "Software Engineer": 78, "Frontend Developer": 65, "Data Scientist": 60 }
     */
    public Map<String, Integer> getBestScoresPerRole(UUID userId) {
        List<ResumeScore> allScores = scoreRepository.findByResumeUserIdOrderByScoredAtDesc(userId);

        return allScores.stream()
                .collect(Collectors.groupingBy(
                        ResumeScore::getJobRole,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparingInt(ResumeScore::getOverallScore)),
                                opt -> opt.map(ResumeScore::getOverallScore).orElse(0)
                        )
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }
}
