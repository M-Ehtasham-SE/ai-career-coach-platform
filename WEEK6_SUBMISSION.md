# Week 6 Submission: Interview Practice Module

## 🎯 Goal
Deliver the **Interview Practice Module** (Week 6 deliverables) — empowering users to simulate AI-driven job interviews with role-specific question generation, real-time per-answer AI feedback, performance scoring (0–100 scale), and a visual 3-step wizard interface.

As requested by the user, this week's work was broken down and pushed to GitHub in **distinct, professional commits/pushes**.

---

## 📋 Completed Tasks & Commits (Pushes)

### 1. Push 1: JPA Entities & Repositories
- Added `Difficulty.java` enum (`EASY`, `MEDIUM`, `HARD`).
- Created `InterviewSession.java` entity tracking target job role, difficulty, overall score, finalization state, and timestamps.
- Created `InterviewAnswer.java` entity storing question text, candidate's response, AI feedback, 0–10 rating, and question index.
- Implemented `InterviewSessionRepository.java` and `InterviewAnswerRepository.java`.

### 2. Push 2: Core Interview Service & AI Prompts
- Implemented `InterviewService.java` with business logic for session creation, OpenAI question generation (5 per session), candidate response evaluation, and session finalization.
- Designed structured JSON system prompts for OpenAI API calls with robust fallbacks when API keys are unconfigured.

### 3. Push 3: REST API Controller & DTOs
- Created `InterviewController.java` with 5 REST endpoints under `/api/v1/interviews`:
  - `POST /sessions/start` — Start new session & receive 5 AI questions
  - `POST /sessions/{id}/answer` — Submit answer & receive instant AI evaluation
  - `POST /sessions/{id}/finalize` — Finalize session & compute overall score (0–100)
  - `GET /sessions` — Retrieve user's session history
  - `GET /sessions/{id}` — Retrieve full detail of a specific session
- Defined strongly-typed DTO records for requests and responses.

### 4. Push 4: Unit Tests & Test Configuration
- Created `InterviewServiceTest.java` with 7 comprehensive unit test cases covering session creation, fallback handling, answer evaluation, ownership authorization, state guards, and score calculation.
- Added H2 in-memory database dependency in `pom.xml` and `src/test/resources/application.properties` to allow isolated unit testing.

### 5. Push 5: Frontend Interactive UI & Dashboard Integration
- Created `interviewService.js` API client for frontend backend communication.
- Created `InterviewPracticePage.jsx` implementing a premium 3-step interactive wizard (Setup → Questions → Results).
- Registered `/interview` route in `App.jsx` with `ProtectedRoute` wrapper.
- Unlocked the "Interview Practice" card on `DashboardPage.jsx`.

### 6. Push 6: Documentation & Submission Summary
- Created `WEEK6_SUBMISSION.md` and updated `README.md` progress status tables.

---

## 🧪 Files Changed

| File | Action |
|------|--------|
| `backend/src/main/java/com/aicareercoach/interview/Difficulty.java` | ✅ Created — Difficulty Enum |
| `backend/src/main/java/com/aicareercoach/interview/InterviewSession.java` | ✅ Created — JPA Entity |
| `backend/src/main/java/com/aicareercoach/interview/InterviewAnswer.java` | ✅ Created — JPA Entity |
| `backend/src/main/java/com/aicareercoach/interview/InterviewSessionRepository.java` | ✅ Created — JPA Repository |
| `backend/src/main/java/com/aicareercoach/interview/InterviewAnswerRepository.java` | ✅ Created — JPA Repository |
| `backend/src/main/java/com/aicareercoach/interview/InterviewService.java` | ✅ Created — Business Logic & AI Integration |
| `backend/src/main/java/com/aicareercoach/interview/InterviewController.java` | ✅ Created — REST Controller & DTOs |
| `backend/src/test/java/com/aicareercoach/interview/InterviewServiceTest.java` | ✅ Created — Unit Tests |
| `backend/src/test/resources/application.properties` | ✅ Created — H2 Test Config |
| `backend/pom.xml` | ✅ Modified — H2 Dependency |
| `frontend/src/services/interviewService.js` | ✅ Created — API Client |
| `frontend/src/pages/InterviewPracticePage.jsx` | ✅ Created — 3-Step Wizard Page |
| `frontend/src/App.jsx` | ✅ Modified — Added Route |
| `frontend/src/pages/DashboardPage.jsx` | ✅ Modified — Unlocked Dashboard Card |
| `README.md` | ✅ Modified — Updated Week 6 Status |
| `WEEK6_SUBMISSION.md` | ✅ Created — Week 6 Documentation |
