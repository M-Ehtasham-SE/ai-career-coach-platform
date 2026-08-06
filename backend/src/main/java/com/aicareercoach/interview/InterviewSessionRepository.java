package com.aicareercoach.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for InterviewSession entities.
 */
@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, UUID> {

    /**
     * Returns all sessions for a user, most recent first.
     */
    List<InterviewSession> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
