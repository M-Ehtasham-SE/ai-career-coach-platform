package com.aicareercoach.interview;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Stores a single question-answer pair within an interview session,
 * along with AI-generated feedback and a per-answer score.
 */
@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The AI-generated interview question */
    @Column(name = "question", columnDefinition = "TEXT", nullable = false)
    private String question;

    /** The candidate's written answer */
    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    /** AI-generated feedback on the answer */
    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    /** Per-answer score from AI (0–10 scale) */
    @Column(name = "score")
    private Integer score;

    /** Question index within the session (1-based) */
    @Column(name = "question_index", nullable = false)
    private int questionIndex;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    // ============================================
    // Constructors
    // ============================================

    public InterviewAnswer() {
    }

    public InterviewAnswer(String question, int questionIndex, InterviewSession session) {
        this.question = question;
        this.questionIndex = questionIndex;
        this.session = session;
    }

    // ============================================
    // Getters & Setters
    // ============================================

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public int getQuestionIndex() { return questionIndex; }
    public void setQuestionIndex(int questionIndex) { this.questionIndex = questionIndex; }

    public LocalDateTime getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; }

    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
}
