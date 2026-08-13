package com.aicareercoach.subscription;

import com.aicareercoach.common.dto.ApiResponse;
import com.aicareercoach.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller exposing subscription management and EasyPaisa payment endpoints.
 * Base path: /subscription
 */
@RestController
@RequestMapping("/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    /**
     * GET /subscription/status
     * Returns the current user's subscription tier, usage, remaining scorings, and EasyPaisa details.
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<SubscriptionStatusResponse>> getStatus(
            @AuthenticationPrincipal User currentUser
    ) {
        SubscriptionStatusResponse status = subscriptionService.getStatus(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Subscription status retrieved", status));
    }

    /**
     * POST /subscription/easypaisa
     * Submits EasyPaisa payment transaction ID for receiver 03229240140 and upgrades user to Premium.
     */
    @PostMapping("/easypaisa")
    public ResponseEntity<ApiResponse<SubscriptionStatusResponse>> processEasyPaisaPayment(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody EasyPaisaPaymentRequest request
    ) {
        SubscriptionStatusResponse updatedStatus = subscriptionService.processEasyPaisaPayment(
                currentUser,
                request.getTransactionId(),
                request.getSenderPhone()
        );
        return ResponseEntity.ok(ApiResponse.success(
                "Payment received! Your Premium subscription has been activated via EasyPaisa.",
                updatedStatus
        ));
    }
}
