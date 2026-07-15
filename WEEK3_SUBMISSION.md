# Week 3 Submission: Resume Upload & Text Extraction

## 🎯 Goal
Build the foundation for resume management - upload, store, and extract text from PDF/DOCX files, accompanied by a high-fidelity interactive frontend UI.

## 📋 Completed Tasks

### 1. Backend Core & Configuration
- **File Upload Setup:** Configured Spring Boot multipart limits (`max-file-size=5MB`) and customized upload directory paths in `application.properties`.
- **Text Extraction Integration:** Added Apache Tika (`tika-core` and `tika-parsers-standard-package`) in `pom.xml` to parse PDF and DOCX files.
- **Fail-Safe Extraction Flow:** Configured the upload service to parse text from the `InputStream` *before* saving the file to disk, achieving transactional safety and preventing orphaned filesystem garbage.

### 2. Entities & Repositories
- **Resume Entity:** Created `com.aicareercoach.resume.Resume` mapping to the `resumes` table. Includes metadata fields: `id` (UUID), `fileName`, `filePath`, `rawText` (stored as `TEXT`), `uploadedAt`, `parsedAt`, `isActive` (boolean for soft deletion), and `user` (Many-to-One mapping).
- **Resume Repository:** Created `com.aicareercoach.resume.ResumeRepository` with optimized query `findByUserIdAndIsActiveTrueOrderByUploadedAtDesc`.

### 3. Business Logic Services
- **FileStorageService:** Manages directory creation on startup, unique filename generation, file deletion, and double-validation (verifying both the file extension and the MIME content type).
- **ResumeService:** Connects storage, parsing, database persistence, and ownership/security controls.

### 4. REST Controller
- **ResumeController:** Exposes the following endpoints:
  - `POST /api/v1/resumes/upload` - Receives multipart resume file, parses it, and returns created metadata.
  - `GET /api/v1/resumes/me` - Lists all active resumes for the authenticated user.
  - `DELETE /api/v1/resumes/{id}` - Authorizes ownership and performs soft deletion (marking inactive & deleting local file).

### 5. Frontend Interactive UI
- **ResumeUploadPage Component:** Beautiful drag-and-drop area with state-aware animations, client-side validation (5MB size check and extension restriction), upload progress indicators, status alerts, and a real-time list of uploaded resumes.
- **Dashboard Integration:** Added an active Quick Action card under "Your Career Tools" to easily manage resumes, maintaining the glassmorphic dark purple theme.
- **Vite Fast Refresh & HMR Fix:** Refactored hook exports out of `AuthContext.jsx` into `useAuth.js` to ensure the dev server remains perfectly stable.

---

## 🧪 Testing & Verification Results

### Unit & Integration Tests
All tests pass successfully under JVM Java 25 / Adoptium.
- Mockito was configured to use `mock-maker-subclass` to bypass strict Java 25 bytecode modification restrictions on class mocks (`FileStorageService`, `JwtService`).
- Created and successfully executed tests checking:
  - Successful text parsing and DB insertion on valid PDF.
  - Correct fetching of user resumes.
  - Valid authorization when deleting a resume.
  - Prevention of unauthorized delete attempts (throws `SecurityException`).

```text
[INFO] Running com.aicareercoach.resume.ResumeServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.462 s
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```
