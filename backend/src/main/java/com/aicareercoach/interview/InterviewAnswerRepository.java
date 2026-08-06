package com.aicareercoach.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for InterviewAnswer entities.
 */
@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, UUID> {

    /**
     * Returns all answers for a given session, ordered chronologically.
     */
    List<InterviewAnswer> findBySessionIdOrderByAnsweredAtAsc(UUID sessionId);

    /**
     * Counts how many answers have been submitted for a session.
     */
    long countBySessionId(UUID sessionId);
}
