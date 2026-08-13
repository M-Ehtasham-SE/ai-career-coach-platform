package com.aicareercoach.subscription;

import java.time.LocalDateTime;

/**
 * Detailed subscription status DTO for the current user.
 */
public record SubscriptionStatusResponse(
        SubscriptionTier tier,
        boolean isPremium,
        String easypaisaNumber,
        String easypaisaAccountTitle,
        int monthlyScoringsUsed,
        int scoringsLimit,
        int scoringsRemaining,
        boolean canScore,
        boolean hasInterviewAccess,
        LocalDateTime expiresAt,
        String easypaisaTrxId
) {
}
