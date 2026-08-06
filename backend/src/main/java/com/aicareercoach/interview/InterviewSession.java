package com.aicareercoach.interview;

import com.aicareercoach.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Represents a single AI-powered interview practice session.
 * One session generates multiple questions and collects user answers.
 */
@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The target job role (e.g., "Frontend Developer") */
    @Column(name = "job_role", nullable = false)
    private String jobRole;

    /** Difficulty level selected by the user */
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;

    /**
     * Overall score (0–100) calculated as the average of per-answer scores.
     * Null until the session is finalized.
     */
    @Column(name = "overall_score")
    private Integer overallScore;

    /** Whether the session has been finalized */
    @Column(name = "finalized", nullable = false)
    private boolean finalized = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("answeredAt ASC")
    private List<InterviewAnswer> answers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ============================================
    // Constructors
    // ============================================

    public InterviewSession() {
    }

    public InterviewSession(String jobRole, Difficulty difficulty, User user) {
        this.jobRole = jobRole;
        this.difficulty = difficulty;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    // ============================================
    // Getters & Setters
    // ============================================

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public boolean isFinalized() { return finalized; }
    public void setFinalized(boolean finalized) { this.finalized = finalized; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getFinalizedAt() { return finalizedAt; }
    public void setFinalizedAt(LocalDateTime finalizedAt) { this.finalizedAt = finalizedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<InterviewAnswer> getAnswers() { return answers; }
    public void setAnswers(List<InterviewAnswer> answers) { this.answers = answers; }
}
