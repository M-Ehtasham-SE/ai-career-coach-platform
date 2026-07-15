package com.aicareercoach.score;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeScoreRepository extends JpaRepository<ResumeScore, UUID> {

    List<ResumeScore> findByResumeIdOrderByScoredAtDesc(UUID resumeId);

    Optional<ResumeScore> findFirstByResumeIdOrderByScoredAtDesc(UUID resumeId);

    List<ResumeScore> findByResumeUserIdOrderByScoredAtDesc(UUID userId);
}
