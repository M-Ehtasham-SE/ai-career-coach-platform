package com.aicareercoach.subscription;

import com.aicareercoach.score.ResumeScore;
import com.aicareercoach.score.ResumeScoreRepository;
import com.aicareercoach.user.User;
import com.aicareercoach.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

/**
 * Service managing user subscriptions, EasyPaisa payments, and feature quota enforcement.
 * EasyPaisa Receiver Number: 03229240140 (Muhammad Ehtasham)
 */
@Service
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    public static final String EASYPAISA_NUMBER = "03229240140";
    public static final String EASYPAISA_ACCOUNT_TITLE = "Muhammad Ehtasham";
    public static final int FREE_MONTHLY_LIMIT = 3;

    private final UserRepository userRepository;
    private final ResumeScoreRepository scoreRepository;

    public SubscriptionService(UserRepository userRepository, ResumeScoreRepository scoreRepository) {
        this.userRepository = userRepository;
        this.scoreRepository = scoreRepository;
    }

    /**
     * Computes subscription status and usage limits for the authenticated user.
     */
    @Transactional(readOnly = true)
    public SubscriptionStatusResponse getStatus(User user) {
        boolean isPremium = user.getSubscriptionTier() == SubscriptionTier.PREMIUM;
        
        // If expired, fall back to FREE
        if (isPremium && user.getSubscriptionExpiresAt() != null && user.getSubscriptionExpiresAt().isBefore(LocalDateTime.now())) {
            isPremium = false;
        }

        int monthlyUsed = countScoringsThisMonth(user);
        int limit = isPremium ? 9999 : FREE_MONTHLY_LIMIT;
        int remaining = Math.max(0, limit - monthlyUsed);
        boolean canScore = isPremium || remaining > 0;
        boolean hasInterviewAccess = true; // Both can access, but Premium gets unlimited

        return new SubscriptionStatusResponse(
                isPremium ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE,
                isPremium,
                EASYPAISA_NUMBER,
                EASYPAISA_ACCOUNT_TITLE,
                monthlyUsed,
                limit,
                remaining,
                canScore,
                hasInterviewAccess,
                user.getSubscriptionExpiresAt(),
                user.getEasypaisaTrxId()
        );
    }

    /**
     * Upgrades user to Premium for 30 days upon EasyPaisa Trx ID submission.
     * EasyPaisa Receiver: 03229240140
     */
    @Transactional
    public SubscriptionStatusResponse processEasyPaisaPayment(User user, String trxId, String senderPhone) {
        log.info("Processing EasyPaisa payment for user {}: Trx ID={}, Phone={}, Target={}",
                user.getEmail(), trxId, senderPhone, EASYPAISA_NUMBER);

        user.setSubscriptionTier(SubscriptionTier.PREMIUM);
        user.setSubscriptionExpiresAt(LocalDateTime.now().plusDays(30));
        user.setEasypaisaTrxId(trxId.trim());

        userRepository.save(user);

        log.info("User {} successfully upgraded to PREMIUM via EasyPaisa Trx ID: {}", user.getEmail(), trxId);
        return getStatus(user);
    }

    /**
     * Counts how many resumes the user has scored in the current calendar month.
     */
    public int countScoringsThisMonth(User user) {
        List<ResumeScore> scores = scoreRepository.findByResumeUserIdOrderByScoredAtDesc(user.getId());
        YearMonth currentMonth = YearMonth.now();
        return (int) scores.stream()
                .filter(s -> s.getScoredAt() != null && YearMonth.from(s.getScoredAt()).equals(currentMonth))
                .count();
    }
}
