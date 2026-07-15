package com.aicareercoach.resume;

import com.aicareercoach.user.Role;
import com.aicareercoach.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ResumeService resumeService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = User.builder()
                .email("test@fast.edu.pk")
                .fullName("Test Student")
                .role(Role.USER)
                .build();
        ReflectionTestUtils.setField(user, "id", userId);
    }

    @Test
    void uploadResume_ShouldSaveResumeAndExtractText_WhenValidFile() throws Exception {
        // Arrange
        String content = "This is some dummy resume text contents.";
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "resume.pdf", 
                "application/pdf", 
                content.getBytes(StandardCharsets.UTF_8)
        );

        String mockPath = "uploads/resumes/mock_resume.pdf";
        when(fileStorageService.storeFile(file)).thenReturn(mockPath);

        Resume savedResume = new Resume();
        savedResume.setFileName("resume.pdf");
        savedResume.setFilePath(mockPath);
        savedResume.setRawText("This is some dummy resume text contents.");
        savedResume.setUser(user);
        savedResume.setUploadedAt(LocalDateTime.now());
        savedResume.setActive(true);

        when(resumeRepository.save(any(Resume.class))).thenReturn(savedResume);

        // Act
        Resume result = resumeService.uploadResume(file, user);

        // Assert
        assertNotNull(result);
        assertEquals("resume.pdf", result.getFileName());
        assertEquals(mockPath, result.getFilePath());
        assertTrue(result.getRawText().contains("dummy resume text contents"));
        assertEquals(user, result.getUser());
        assertTrue(result.isActive());

        verify(fileStorageService).storeFile(file);
        verify(resumeRepository).save(any(Resume.class));
    }

    @Test
    void getActiveResumesForUser_ShouldReturnList() {
        // Arrange
        Resume resume = new Resume("resume.pdf", "path/to/resume.pdf", "text", user);
        when(resumeRepository.findByUserIdAndIsActiveTrueOrderByUploadedAtDesc(userId))
                .thenReturn(List.of(resume));

        // Act
        List<Resume> result = resumeService.getActiveResumesForUser(userId);

        // Assert
        assertEquals(1, result.size());
        assertEquals("resume.pdf", result.get(0).getFileName());
        verify(resumeRepository).findByUserIdAndIsActiveTrueOrderByUploadedAtDesc(userId);
    }

    @Test
    void deleteResume_ShouldSoftDelete_WhenAuthorized() {
        // Arrange
        UUID resumeId = UUID.randomUUID();
        Resume resume = new Resume("resume.pdf", "path/to/resume.pdf", "text", user);
        ReflectionTestUtils.setField(resume, "id", resumeId);

        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(resume));

        // Act
        resumeService.deleteResume(resumeId, userId);

        // Assert
        assertFalse(resume.isActive());
        verify(resumeRepository).save(resume);
        verify(fileStorageService).deleteFile("path/to/resume.pdf");
    }

    @Test
    void deleteResume_ShouldThrowSecurityException_WhenNotAuthorized() {
        // Arrange
        UUID resumeId = UUID.randomUUID();
        Resume resume = new Resume("resume.pdf", "path/to/resume.pdf", "text", user);
        ReflectionTestUtils.setField(resume, "id", resumeId);

        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(resume));

        UUID randomUser = UUID.randomUUID();

        // Act & Assert
        assertThrows(SecurityException.class, () -> resumeService.deleteResume(resumeId, randomUser));
        verify(resumeRepository, never()).save(any());
        verify(fileStorageService, never()).deleteFile(any());
    }
}
