# User Stories & Acceptance Criteria
## AI-Powered Career Coach Platform

---

## Epic 1: User Authentication

### Story 1.1: User Registration
**As a** new user  
**I want to** register an account  
**So that** I can access the platform and save my progress

**Acceptance Criteria:**
- [ ] Registration form has fields: Full Name, Email, Password, Confirm Password
- [ ] Password must be at least 8 characters with one number
- [ ] Email must be in valid format (e.g., name@domain.com)
- [ ] Duplicate email shows error: "Email already registered"
- [ ] On successful registration, user is automatically logged in
- [ ] User is redirected to dashboard
- [ ] Welcome email is sent (optional - future)

---

### Story 1.2: User Login
**As a** registered user  
**I want to** login to my account  
**So that** I can access my resumes, scores, and progress

**Acceptance Criteria:**
- [ ] Login form has fields: Email, Password
- [ ] Invalid credentials show: "Invalid email or password"
- [ ] Successful login redirects to dashboard
- [ ] JWT token is stored securely (HTTP-only cookie)
- [ ] Session persists across page reloads
- [ ] "Remember Me" option (optional)

---

### Story 1.3: User Logout
**As a** logged-in user  
**I want to** logout of my account  
**So that** I can secure my session on shared devices

**Acceptance Criteria:**
- [ ] Logout button is visible in navigation
- [ ] Clicking logout clears JWT token
- [ ] User is redirected to landing page
- [ ] Session is terminated on server side

---

## Epic 2: Resume Management

### Story 2.1: Upload Resume
**As a** user  
**I want to** upload my resume  
**So that** I can get it scored and analyzed

**Acceptance Criteria:**
- [ ] Upload supports PDF and DOCX formats
- [ ] Max file size is 5MB
- [ ] Drag-and-drop functionality works
- [ ] Browse button works as alternative
- [ ] Upload shows progress indicator
- [ ] Success message: "Resume uploaded successfully"
- [ ] Error message for invalid format: "Please upload PDF or DOCX"
- [ ] Error message for large file: "File exceeds 5MB limit"
- [ ] Resume is stored with unique ID
- [ ] Raw text is extracted for AI processing

---

### Story 2.2: Select Job Role
**As a** user  
**I want to** select a job role for my resume  
**So that** I get role-specific scoring and feedback

**Acceptance Criteria:**
- [ ] Four roles available: FRONTEND, BACKEND, DATA, UIUX
- [ ] Role selection is required before scoring
- [ ] Roles are displayed as clickable buttons/pills
- [ ] Selected role is highlighted
- [ ] Role can be changed and resume re-scored
- [ ] Role-specific feedback is generated

---

### Story 2.3: Get Resume Score
**As a** user  
**I want to** see my resume score with detailed feedback  
**So that** I know my strengths and what to improve

**Acceptance Criteria:**
- [ ] Overall score is displayed as 0-100
- [ ] Score has color coding:
  - Red: 0-50 (Needs Improvement)
  - Orange: 51-70 (Good)
  - Green: 71-100 (Excellent)
- [ ] At least 3 strengths are listed
- [ ] At least 3 weaknesses are listed
- [ ] At least 3 actionable suggestions are provided
- [ ] Feedback is role-specific
- [ ] Score is saved in database with timestamp
- [ ] User can view historical scores

---

### Story 2.4: View Resume History
**As a** user  
**I want to** view all my past resume scores  
**So that** I can track my improvement over time

**Acceptance Criteria:**
- [ ] List shows: Resume name, Role, Score, Date
- [ ] Scores are sorted by date (newest first)
- [ ] Clicking a score opens detailed view
- [ ] Filter by role (optional)
- [ ] Filter by date range (optional)
- [ ] Chart shows score trend over time

---

## Epic 3: Interview Practice

### Story 3.1: Start Interview Session
**As a** user  
**I want to** start an interview practice session  
**So that** I can prepare for real interviews

**Acceptance Criteria:**
- [ ] User selects a job role before starting
- [ ] Options: Number of questions (5/10/15)
- [ ] Options: Difficulty (Easy/Medium/Hard) - future
- [ ] Session has a unique ID
- [ ] Start timestamp is recorded
- [ ] First question is displayed immediately
- [ ] Session is saved in database

---

### Story 3.2: Answer Interview Questions
**As a** user  
**I want to** answer interview questions and get feedback  
**So that** I can improve my interview skills

**Acceptance Criteria:**
- [ ] Question is displayed clearly
- [ ] Answer field accepts text input
- [ ] No audio required for MVP
- [ ] Each answer is submitted individually
- [ ] Progress shows: "Question X of Y"
- [ ] Timer shows time spent (optional)

---

### Story 3.3: Get AI Feedback on Answers
**As a** user  
**I want to** receive AI feedback on my answers  
**So that** I know what I did well and what to improve

**Acceptance Criteria:**
- [ ] AI provides score (0-100) per answer
- [ ] AI provides constructive feedback
- [ ] Feedback includes both praise and improvement areas
- [ ] Feedback is specific and actionable
- [ ] Score and feedback are saved in database
- [ ] Feedback generates within 3-5 seconds

---

### Story 3.4: Complete Interview Session
**As a** user  
**I want to** complete the session and see my overall score  
**So that** I can evaluate my overall performance

**Acceptance Criteria:**
- [ ] "End Session" button is available
- [ ] Overall session score is calculated (average of answers)
- [ ] Session summary shows:
  - Questions answered
  - Average score
  - Role selected
  - Time taken
- [ ] Session is saved in history
- [ ] User can review all questions and answers

---

### Story 3.5: View Interview History
**As a** user  
**I want to** view all my past interview sessions  
**So that** I can track my interview preparation progress

**Acceptance Criteria:**
- [ ] List shows: Role, Questions, Score, Date
- [ ] Average score per session is displayed
- [ ] Sessions sorted by date (newest first)
- [ ] Clicking session opens detailed view
- [ ] Stats summary: Total sessions, Average score, Best role

---

## Epic 4: Progress Tracking

### Story 4.1: View Progress Dashboard
**As a** user  
**I want to** see my overall progress dashboard  
**So that** I can visualize my improvement

**Acceptance Criteria:**
- [ ] Dashboard shows key metrics:
  - Total resumes uploaded
  - Total interview sessions
  - Total questions answered
  - Improvement percentage
- [ ] Resume score history (line chart)
- [ ] Interview performance (line chart)
- [ ] Role-wise comparison (bar chart)
- [ ] Dashboard loads within 2 seconds

---

### Story 4.2: View Achievements
**As a** user  
**I want to** see my achievements and milestones  
**So that** I stay motivated

**Acceptance Criteria:**
- [ ] Achievements are displayed as badges/cards
- [ ] Examples:
  - "First Resume Scored!"
  - "Completed 5 Interview Sessions"
  - "Improved Resume Score by 20%"
  - "Attempted 50 Interview Questions"
- [ ] Locked achievements show progress
- [ ] Unlocked achievements show date earned

---

### Story 4.3: Get Learning Recommendations
**As a** user  
**I want to** get personalized learning recommendations  
**So that** I know what to study next

**Acceptance Criteria:**
- [ ] Recommendations are based on weaknesses from resume
- [ ] At least 3 learning resources are recommended
- [ ] Resources are categorized: Courses, YouTube, Books
- [ ] Each recommendation has: Title, Source, Estimated time
- [ ] User can mark resources as "completed"
- [ ] Recommendations update after each resume scoring

---

## Epic 5: Profile Management

### Story 5.1: Update Profile
**As a** user  
**I want to** update my profile information  
**So that** my account has accurate information

**Acceptance Criteria:**
- [ ] User can update full name
- [ ] User can update email
- [ ] Profile updates require current password verification
- [ ] Changes are saved to database
- [ ] Success message: "Profile updated successfully"

---

### Story 5.2: Change Password
**As a** user  
**I want to** change my password  
**So that** my account stays secure

**Acceptance Criteria:**
- [ ] Form fields: Current Password, New Password, Confirm Password
- [ ] Current password must be verified
- [ ] New password must be 8+ characters with one number
- [ ] Success message: "Password changed successfully"
- [ ] User is logged out after password change (security)

---

### Story 5.3: Manage Notifications
**As a** user  
**I want to** manage my notification preferences  
**So that** I only receive updates that matter to me

**Acceptance Criteria:**
- [ ] Toggle: Email notifications
- [ ] Toggle: Weekly progress reports
- [ ] Toggle: Achievement alerts
- [ ] Preferences are saved to database

---

### Story 5.4: Delete Account
**As a** user  
**I want to** delete my account  
**So that** my data is removed if I no longer need the service

**Acceptance Criteria:**
- [ ] "Delete Account" button is in Danger Zone
- [ ] Confirmation dialog: "Are you sure?"
- [ ] Requires password verification
- [ ] All user data is deleted (cascade)
- [ ] Success message: "Account deleted successfully"
- [ ] User is logged out and redirected to landing page

---

## Epic 6: Admin (Future Scope)

### Story 6.1: View Admin Dashboard
**As an** admin  
**I want to** view system analytics  
**So that** I can monitor platform health and usage

**Acceptance Criteria:**
- [ ] Total users count
- [ ] Total resumes scored
- [ ] Total interview sessions
- [ ] AI API usage and costs
- [ ] Revenue (if premium tier)

---

### Story 6.2: Manage Users
**As an** admin  
**I want to** manage users  
**So that** I can handle reports and issues

**Acceptance Criteria:**
- [ ] List of all users with details
- [ ] Search by name or email
- [ ] Filter by role (USER/ADMIN)
- [ ] Ban/unban users
- [ ] Change user role

---

## User Story Summary

| Epic | Stories | Priority |
|------|---------|----------|
| Epic 1: Authentication | 3 | Must Have |
| Epic 2: Resume Management | 4 | Must Have |
| Epic 3: Interview Practice | 5 | Should Have |
| Epic 4: Progress Tracking | 3 | Should Have |
| Epic 5: Profile Management | 4 | Could Have |
| Epic 6: Admin | 2 | Won't Have (Future) |
| **Total** | **21** | |

---

**End of User Stories**