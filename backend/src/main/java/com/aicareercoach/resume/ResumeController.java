package com.aicareercoach.resume;

import com.aicareercoach.common.dto.ApiResponse;
import com.aicareercoach.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Endpoints for managing user resumes.
 */
@RestController
@RequestMapping("/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Upload and parse a resume.
     * POST /api/v1/resumes/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            Resume resume = resumeService.uploadResume(file, currentUser);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Resume uploaded and parsed successfully", ResumeResponse.of(resume)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get all active resumes of the current user.
     * GET /api/v1/resumes/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getMyResumes(
            @AuthenticationPrincipal User currentUser
    ) {
        List<ResumeResponse> resumes = resumeService.getActiveResumesForUser(currentUser.getId())
                .stream()
                .map(ResumeResponse::of)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(resumes));
    }

    /**
     * Soft delete a resume.
     * DELETE /api/v1/resumes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable("id") UUID resumeId,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            resumeService.deleteResume(resumeId, currentUser.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    /**
     * DTO for Resume details.
     */
    public record ResumeResponse(
            UUID id,
            String fileName,
            String rawText,
            LocalDateTime uploadedAt,
            LocalDateTime parsedAt
    ) {
        public static ResumeResponse of(Resume resume) {
            return new ResumeResponse(
                    resume.getId(),
                    resume.getFileName(),
                    resume.getRawText(),
                    resume.getUploadedAt(),
                    resume.getParsedAt()
            );
        }
    }
}
