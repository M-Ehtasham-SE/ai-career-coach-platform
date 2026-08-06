package com.aicareercoach.interview;

import com.aicareercoach.ai.OpenAiService;
import com.aicareercoach.user.User;
import com.aicareercoach.user.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Core service for the Interview Practice module.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Start a new interview session and generate AI questions</li>
 *   <li>Evaluate a user's answer using AI and persist feedback</li>
 *   <li>Finalize a session and compute the overall score</li>
 *   <li>Retrieve session history and session detail</li>
 * </ul>
 */
@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    /** Number of questions generated per session */
    private static final int QUESTIONS_PER_SESSION = 5;

    private final InterviewSessionRepository sessionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    // ─── System Prompts ───────────────────────────────────────────────────────

    private static final String QUESTION_GENERATION_SYSTEM_PROMPT = """
            You are an expert technical interviewer. Generate exactly 5 interview questions for the given job role and difficulty level.
            Return ONLY a valid JSON object with exactly this structure:
            {
                "questions": [
                    "Question 1 text here",
                    "Question 2 text here",
                    "Question 3 text here",
                    "Question 4 text here",
                    "Question 5 text here"
                ]
            }
            Guidelines:
            - EASY: foundational concepts, definitions, simple scenarios
            - MEDIUM: applied knowledge, moderate problem-solving, design trade-offs
            - HARD: deep expertise, architecture decisions, complex edge cases
            Questions must be specific, professional, and directly relevant to the role.
            """;

    private static final String ANSWER_EVALUATION_SYSTEM_PROMPT = """
            You are an expert technical interviewer evaluating a candidate's answer.
            Return ONLY a valid JSON object with exactly this structure:
            {
                "score": <integer from 0 to 10>,
                "feedback": "<2-4 sentence constructive feedback string>"
            }
            Scoring guide:
            - 9-10: Excellent — complete, accurate, includes advanced insights
            - 7-8:  Good — mostly correct with minor gaps
            - 5-6:  Fair — correct basics but misses important details
            - 3-4:  Weak — partially correct, significant gaps
            - 0-2:  Poor — largely incorrect or off-topic
            Provide specific, actionable, and professional feedback.
            """;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public InterviewService(
            InterviewSessionRepository sessionRepository,
            InterviewAnswerRepository answerRepository,
            UserRepository userRepository,
            OpenAiService openAiService
    ) {
        this.sessionRepository = sessionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.openAiService = openAiService;
        this.objectMapper = new ObjectMapper();
    }

    // ─── Public API ───────────────────────────────────────────────────────────

    /**
     * Starts a new interview session for the given user.
     * Creates the session, calls AI to generate questions, persists placeholder answers,
     * and returns the session with its questions.
     *
     * @param userId     the authenticated user's ID
     * @param jobRole    the target job role (e.g., "Frontend Developer")
     * @param difficulty the desired difficulty level
     * @return the persisted session populated with generated questions
     */
    @Transactional
    public InterviewSession startSession(UUID userId, String jobRole, Difficulty difficulty) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String role = (jobRole != null && !jobRole.isBlank()) ? jobRole.trim() : "Software Engineer";
        Difficulty diff = (difficulty != null) ? difficulty : Difficulty.MEDIUM;

        // Persist the session first so we have an ID
        InterviewSession session = new InterviewSession(role, diff, user);
        session = sessionRepository.save(session);

        // Generate questions from AI
        List<String> questions = generateQuestions(role, diff);

        // Persist each question as an unanswered InterviewAnswer placeholder
        List<InterviewAnswer> answerPlaceholders = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            InterviewAnswer placeholder = new InterviewAnswer(questions.get(i), i + 1, session);
            answerPlaceholders.add(placeholder);
        }
        answerRepository.saveAll(answerPlaceholders);
        session.setAnswers(answerPlaceholders);

        log.info("Started interview session {} for user {} — role: {}, difficulty: {}", session.getId(), userId, role, diff);
        return session;
    }

    /**
     * Submits a user's answer for a specific question in a session.
     * Calls AI for evaluation, persists feedback and score, and returns the updated answer.
     *
     * @param sessionId    the session ID
     * @param userId       the authenticated user's ID (ownership check)
     * @param questionIndex the 1-based index of the question being answered
     * @param userAnswer   the candidate's written answer
     * @return the persisted InterviewAnswer with AI feedback
     */
    @Transactional
    public InterviewAnswer submitAnswer(UUID sessionId, UUID userId, int questionIndex, String userAnswer) {
        InterviewSession session = getSessionForUser(sessionId, userId);

        if (session.isFinalized()) {
            throw new IllegalStateException("Cannot submit answers to a finalized session.");
        }

        // Find the placeholder for this question index
        InterviewAnswer answer = session.getAnswers().stream()
                .filter(a -> a.getQuestionIndex() == questionIndex)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Question index " + questionIndex + " not found in session."));

        // Evaluate via AI
        String feedback = "";
        int score = 5;
        try {
            JsonNode evaluation = evaluateAnswer(answer.getQuestion(), userAnswer, session.getJobRole());
            score = Math.min(10, Math.max(0, evaluation.path("score").asInt(5)));
            feedback = evaluation.path("feedback").asText("Good attempt. Keep practicing.");
        } catch (Exception e) {
            log.warn("AI evaluation failed for session {}, question {}: {}", sessionId, questionIndex, e.getMessage());
            feedback = "Your answer has been recorded. AI feedback is temporarily unavailable.";
        }

        // Persist the answer
        answer.setUserAnswer(userAnswer);
        answer.setAiFeedback(feedback);
        answer.setScore(score);
        answer.setAnsweredAt(LocalDateTime.now());

        InterviewAnswer saved = answerRepository.save(answer);
        log.info("Answer submitted for session {}, question {}: score {}", sessionId, questionIndex, score);
        return saved;
    }

    /**
     * Finalizes the session: computes overall score as average of answer scores
     * (answers without a score are treated as 0), marks session finalized.
     *
     * @param sessionId the session ID
     * @param userId    the authenticated user's ID (ownership check)
     * @return the finalized session
     */
    @Transactional
    public InterviewSession finalizeSession(UUID sessionId, UUID userId) {
        InterviewSession session = getSessionForUser(sessionId, userId);

        if (session.isFinalized()) {
            return session; // idempotent
        }

        List<InterviewAnswer> answers = answerRepository.findBySessionIdOrderByAnsweredAtAsc(sessionId);

        // Average score across all questions (0–10 scale), then scale to 0–100
        double avgScore = answers.stream()
                .mapToInt(a -> a.getScore() != null ? a.getScore() : 0)
                .average()
                .orElse(0.0);

        int overallScore = (int) Math.round(avgScore * 10); // 0-10 → 0-100

        session.setOverallScore(overallScore);
        session.setFinalized(true);
        session.setFinalizedAt(LocalDateTime.now());

        InterviewSession saved = sessionRepository.save(session);
        log.info("Session {} finalized. Overall score: {}", sessionId, overallScore);
        return saved;
    }

    /**
     * Returns all interview sessions for a user (most recent first).
     */
    public List<InterviewSession> getSessionHistory(UUID userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Returns the full detail of a single session including all answers.
     */
    @Transactional(readOnly = true)
    public InterviewSession getSessionDetail(UUID sessionId, UUID userId) {
        return getSessionForUser(sessionId, userId);
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    /**
     * Fetches and validates that the session belongs to the given user.
     */
    private InterviewSession getSessionForUser(UUID sessionId, UUID userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Interview session not found."));

        if (!session.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to access this session.");
        }
        return session;
    }

    /**
     * Calls OpenAI to generate interview questions for the given role and difficulty.
     */
    private List<String> generateQuestions(String jobRole, Difficulty difficulty) {
        String userPrompt = String.format(
                "Generate %d interview questions for a %s position at %s difficulty level.",
                QUESTIONS_PER_SESSION, jobRole, difficulty.name()
        );

        try {
            JsonNode response = openAiService.analyzeWithJson(QUESTION_GENERATION_SYSTEM_PROMPT, userPrompt);
            JsonNode questionsNode = response.path("questions");

            List<String> questions = new ArrayList<>();
            if (questionsNode.isArray()) {
                for (JsonNode q : questionsNode) {
                    questions.add(q.asText());
                }
            }

            // Fallback if AI returns fewer questions than expected
            while (questions.size() < QUESTIONS_PER_SESSION) {
                questions.add(getFallbackQuestion(jobRole, questions.size() + 1));
            }

            return questions.subList(0, QUESTIONS_PER_SESSION);
        } catch (Exception e) {
            log.error("Question generation failed: {}", e.getMessage(), e);
            return getFallbackQuestions(jobRole);
        }
    }

    /**
     * Calls OpenAI to evaluate a single answer.
     */
    private JsonNode evaluateAnswer(String question, String answer, String jobRole) {
        String userPrompt = String.format(
                "Job Role: %s\nQuestion: %s\nCandidate's Answer: %s",
                jobRole, question, answer
        );
        return openAiService.analyzeWithJson(ANSWER_EVALUATION_SYSTEM_PROMPT, userPrompt);
    }

    /**
     * Fallback questions when AI is unavailable.
     */
    private List<String> getFallbackQuestions(String jobRole) {
        return List.of(
                "Tell me about yourself and your experience as a " + jobRole + ".",
                "What are your key technical strengths relevant to this role?",
                "Describe a challenging project you worked on and how you handled it.",
                "How do you stay up to date with the latest industry trends and technologies?",
                "Where do you see yourself professionally in the next 3-5 years?"
        );
    }

    private String getFallbackQuestion(String jobRole, int index) {
        return getFallbackQuestions(jobRole).get(Math.min(index - 1, 4));
    }
}
