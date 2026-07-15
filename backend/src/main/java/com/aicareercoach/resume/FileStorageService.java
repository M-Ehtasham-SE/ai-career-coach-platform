package com.aicareercoach.resume;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;
import jakarta.annotation.PostConstruct;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads/resumes}")
    private String uploadDirStr;

    private Path uploadStorageLocation;

    @PostConstruct
    public void init() {
        this.uploadStorageLocation = Paths.get(uploadDirStr).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores the file on disk. Performs validation on extensions and mime types.
     * @return Absolute/Normalized string representation of the stored file path.
     */
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename).toLowerCase();
        
        if (!extension.equals("pdf") && !extension.equals("docx")) {
            throw new IllegalArgumentException("Only PDF and DOCX files are allowed.");
        }
        
        String contentType = file.getContentType();
        if (contentType != null) {
            if (!contentType.equals("application/pdf") && 
                !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                !contentType.equals("application/octet-stream")) {
                throw new IllegalArgumentException("Invalid file content type: " + contentType);
            }
        }

        // Generate unique clean filename
        String cleanFileName = UUID.randomUUID().toString() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");

        try {
            if (cleanFileName.contains("..")) {
                throw new IllegalArgumentException("Filename contains invalid path sequence " + cleanFileName);
            }

            Path targetLocation = this.uploadStorageLocation.resolve(cleanFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.toString();
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + cleanFileName + ". Please try again!", ex);
        }
    }

    /**
     * Deletes a file from local disk.
     */
    public void deleteFile(String filePathString) {
        try {
            Path filePath = Paths.get(filePathString);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            System.err.println("Warning: Failed to delete file at: " + filePathString);
        }
    }

    private String getFileExtension(String fileName) {
        int lastIndexOf = fileName.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return "";
        }
        return fileName.substring(lastIndexOf + 1);
    }
}
