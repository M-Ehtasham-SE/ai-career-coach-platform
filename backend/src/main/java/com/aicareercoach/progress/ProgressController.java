package com.aicareercoach.progress;

import com.aicareercoach.common.dto.ApiResponse;
import com.aicareercoach.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing career progress statistics for the authenticated user.
 *
 * <p>Base path: {@code /api/v1/progress}
 *
 * <p>All endpoints require a valid JWT (enforced by Spring Security filter chain).
 */
@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    /**
     * Returns the full aggregated progress stats for the authenticated user.
     *
     * <p>Covers:
     * <ul>
     *   <li>Resume and score counts</li>
     *   <li>Best resume and interview scores</li>
     *   <li>Career Readiness Index (weighted composite)</li>
     *   <li>Last 5 resume scores (trend data)</li>
     *   <li>Last 5 interview sessions (history)</li>
     *   <li>Best scores per job role</li>
     * </ul>
     *
     * <p>GET /api/v1/progress/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ProgressStatsResponse>> getProgressStats(
            @AuthenticationPrincipal User currentUser
    ) {
        ProgressStatsResponse stats = progressService.getUserStats(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Progress stats retrieved", stats));
    }
}
