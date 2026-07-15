package com.aicareercoach.score;

import com.aicareercoach.resume.Resume;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Stores AI-generated resume evaluation results.
 */
@Entity
@Table(name = "resume_scores")
public class ResumeScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "overall_score", nullable = false)
    private int overallScore;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths; // JSON array as string

    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknesses; // JSON array as string

    @Column(name = "suggestions", columnDefinition = "TEXT")
    private String suggestions; // JSON array as string

    @Column(name = "job_role")
    private String jobRole;

    @Column(name = "scored_at", nullable = false)
    private LocalDateTime scoredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @PrePersist
    protected void onCreate() {
        this.scoredAt = LocalDateTime.now();
    }

    // ============================================
    // Constructors
    // ============================================

    public ResumeScore() {
    }

    // ============================================
    // Getters and Setters
    // ============================================

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }

    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public LocalDateTime getScoredAt() { return scoredAt; }
    public void setScoredAt(LocalDateTime scoredAt) { this.scoredAt = scoredAt; }

    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
}
