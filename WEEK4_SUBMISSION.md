# Week 4 Submission: Resume Score System

## 🎯 Goal
Deliver a fully functional, AI-powered resume scoring system — connecting the OpenAI-backed backend scoring pipeline to a premium, dedicated frontend UI — enabling users to evaluate their resumes against specific job roles and track their scoring history.

---

## 📋 Completed Tasks

### 1. Backend Unit Tests — `ResumeScoreService`
Created `ResumeScoreServiceTest.java` with **8 comprehensive unit tests** using Mockito:

| Test | Scenario |
|------|----------|
| `scoreResume_ShouldAnalyzeAndPersistScore_WhenInputIsValid` | Happy path — AI returns JSON, entity is persisted |
| `scoreResume_ShouldDefaultToSoftwareEngineer_WhenRoleIsBlank` | Blank role string defaults to `"Software Engineer"` |
| `scoreResume_ShouldThrowIllegalArgumentException_WhenResumeNotFound` | Resume UUID not in DB → 400 |
| `scoreResume_ShouldThrowSecurityException_WhenUserDoesNotOwnResume` | Different user ID → 403 |
| `scoreResume_ShouldThrowIllegalStateException_WhenResumeHasNoRawText` | Null `rawText` → 500 |
| `getLatestScore_ShouldReturnScore_WhenUserOwnsResume` | Owner can read their own score |
| `getLatestScore_ShouldThrowSecurityException_WhenUserDoesNotOwnResume` | Unauthorized read → 403 |
| `getAllScoresForUser_ShouldDelegateToRepository` | Correct delegation to the repo |

### 2. Frontend — Dedicated Resume Scoring Page (`ResumeScoringPage.jsx`)
A premium, full-page AI scoring experience featuring:
- **Resume Selector** — Fetches all user's resumes and allows one-click selection with visual feedback
- **Job Role Picker** — 8 curated role buttons (Software Engineer, Frontend Dev, Backend Dev, Full Stack, Data Scientist, DevOps, UI/UX, Product Manager) + custom free-text role input
- **AI Analysis Flow** — Animated pulsing loading state with descriptive step badges while OpenAI processes the request
- **Score Results** — Renders the existing `ScoreDisplay` component with the circular gauge, strengths, weaknesses, and suggestions
- **Score History Panel** — Fetches and displays all previous scores for the selected resume with coloured score badges and timestamps; clicking any historical score loads it into the display area
- Consistent glassmorphic dark purple theme with ambient glow effects

### 3. Routing Update (`App.jsx`)
Added a new protected route: `GET /score` → `<ResumeScoringPage />`.

### 4. Dashboard Update (`DashboardPage.jsx`)
- **Unlocked** the "AI Scoring" card — removed `opacity-60` / "Locked" state
- Replaced static `<div>` with an active `<Link to="/score">` component
- Themed with amber/orange gradient to visually differentiate it from the indigo Resume card

---

## 🧪 Testing & Verification Results

### Unit Tests
```text
[INFO] Running com.aicareercoach.score.ResumeScoreServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### Manual Verification Checklist
- [x] Dashboard shows an active, amber-themed "AI Scoring" card
- [x] Clicking the card navigates to `/score`
- [x] Resume list loads correctly from the backend
- [x] Selecting a resume loads its score history
- [x] All 8 job role buttons are clickable and visually active when selected
- [x] Custom role text input works with the toggle
- [x] "Analyze Resume" button triggers scoring and shows the animated loading state
- [x] `ScoreDisplay` renders correctly with mock data (when no OpenAI key configured)
- [x] Score history panel shows all previous scores with colour-coded badges
- [x] Clicking a historical score loads it into the display panel

---

## 📁 Files Changed

| File | Action |
|------|--------|
| `backend/src/test/java/com/aicareercoach/score/ResumeScoreServiceTest.java` | ✅ Created |
| `frontend/src/pages/ResumeScoringPage.jsx` | ✅ Created |
| `frontend/src/App.jsx` | ✅ Modified — added `/score` route |
| `frontend/src/pages/DashboardPage.jsx` | ✅ Modified — unlocked AI Scoring card |
| `README.md` | ✅ Modified — Week 4 marked complete |
| `WEEK4_SUBMISSION.md` | ✅ Created |
