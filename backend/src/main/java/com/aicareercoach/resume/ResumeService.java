package com.aicareercoach.resume;

import com.aicareercoach.user.User;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final FileStorageService fileStorageService;
    private final Tika tika;

    public ResumeService(ResumeRepository resumeRepository, FileStorageService fileStorageService) {
        this.resumeRepository = resumeRepository;
        this.fileStorageService = fileStorageService;
        this.tika = new Tika();
    }

    /**
     * Handles file storage, text extraction via Tika, and DB entry creation.
     */
    @Transactional
    public Resume uploadResume(MultipartFile file, User user) {
        // 1. Parse the text from the MultipartFile stream via Apache Tika
        String rawText = "";
        try (InputStream stream = file.getInputStream()) {
            rawText = tika.parseToString(stream);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from the resume: " + e.getMessage(), e);
        }

        // 2. Store the uploaded file
        String filePath = fileStorageService.storeFile(file);

        // 3. Construct and save the entity
        Resume resume = new Resume();
        resume.setFileName(file.getOriginalFilename());
        resume.setFilePath(filePath);
        resume.setRawText(rawText);
        resume.setUser(user);
        resume.setUploadedAt(LocalDateTime.now());
        resume.setParsedAt(LocalDateTime.now());
        resume.setActive(true);

        return resumeRepository.save(resume);
    }

    /**
     * Gets all active resumes belonging to a user.
     */
    public List<Resume> getActiveResumesForUser(UUID userId) {
        return resumeRepository.findByUserIdAndIsActiveTrueOrderByUploadedAtDesc(userId);
    }

    /**
     * Soft deletes a resume from the database and deletes the physical file.
     */
    @Transactional
    public void deleteResume(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found."));

        if (!resume.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to delete this resume.");
        }

        resume.setActive(false);
        resumeRepository.save(resume);

        fileStorageService.deleteFile(resume.getFilePath());
    }

    /**
     * Retrieves a resume by ID with authorization checks.
     */
    public Resume getResumeById(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found."));

        if (!resume.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to view this resume.");
        }

        return resume;
    }
}
