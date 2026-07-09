# API Endpoint Plan
## AI-Powered Career Coach Platform
### REST API Design

---

## 📋 API Overview

**Base URL:** `http://localhost:8080/api/v1`

**Authentication:** JWT Bearer Token

**Response Format:** JSON

**Status Codes:**
- 200 OK - Success
- 201 Created - Resource created
- 204 No Content - Deletion successful
- 400 Bad Request - Invalid input
- 401 Unauthorized - Missing/invalid token
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

---

## 🔐 Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

**Request:**
```json
{
    "email": "student@fast.edu.pk",
    "password": "SecurePass123!",
    "fullName": "Ali Hassan"
}
Response (201 Created):
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "id": "7f9a3b2c-...",
        "email": "student@fast.edu.pk",
        "fullName": "Ali Hassan",
        "role": "USER",
        "createdAt": "2026-07-09T10:30:00Z"
    }
}
Error Responses:

400: "Email already registered"

400: "Password must be 8+ characters with one number"

400: "Invalid email format"

2. User Login
POST /auth/login

Request:
{
    "email": "student@fast.edu.pk",
    "password": "SecurePass123!"
}
Response (200 OK):
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "tokenType": "Bearer",
        "expiresIn": 86400000,
        "user": {
            "id": "7f9a3b2c-...",
            "email": "student@fast.edu.pk",
            "fullName": "Ali Hassan",
            "role": "USER"
        }
    }
}
Error Responses:

401: "Invalid email or password"

400: "Email and password required"

3. User Logout
POST /auth/logout

Request: None (client-side token removal)

Response (200 OK):

{
    "status": "success",
    "message": "Logged out successfully"
}
👤 User Endpoints
4. Get Current User
GET /users/me

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "id": "7f9a3b2c-...",
        "email": "student@fast.edu.pk",
        "fullName": "Ali Hassan",
        "role": "USER",
        "createdAt": "2026-07-09T10:30:00Z",
        "updatedAt": "2026-07-09T10:30:00Z"
    }
}
Error Responses:

401: "Unauthorized - Token required"

404: "User not found"

5. Update User Profile
PUT /users/me

Headers: Authorization: Bearer <token>

Request:

{
    "fullName": "Ali Hassan Khan",
    "email": "alihassan@fast.edu.pk"
}
Response (200 OK):
{
    "status": "success",
    "message": "Profile updated successfully",
    "data": {
        "id": "7f9a3b2c-...",
        "email": "alihassan@fast.edu.pk",
        "fullName": "Ali Hassan Khan",
        "role": "USER"
    }
}
6. Change Password
PUT /users/me/password

Headers: Authorization: Bearer <token>

Request:


{
    "currentPassword": "OldPass123!",
    "newPassword": "NewSecurePass456!",
    "confirmPassword": "NewSecurePass456!"
}
Response (200 OK):
{
    "status": "success",
    "message": "Password changed successfully"
}
Error Responses:

400: "Current password is incorrect"

400: "New password does not match confirmation"

📄 Resume Endpoints
7. Upload Resume
POST /resumes/upload

Headers: Authorization: Bearer <token>

Request: multipart/form-data
file: [PDF/DOCX binary]
Response (201 Created):
{
    "status": "success",
    "message": "Resume uploaded successfully",
    "data": {
        "id": "a1b2c3d4-...",
        "fileName": "Ali_Resume.pdf",
        "fileSize": 245760,
        "uploadedAt": "2026-07-09T10:35:00Z",
        "status": "PENDING_PARSING"
    }
}
Error Responses:

400: "Invalid file format. Only PDF and DOCX allowed"

400: "File exceeds 5MB limit"

8. Get All User Resumes
GET /resumes/me

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "resumes": [
            {
                "id": "a1b2c3d4-...",
                "fileName": "Ali_Resume.pdf",
                "uploadedAt": "2026-07-09T10:35:00Z",
                "isActive": true,
                "scores": [
                    {
                        "role": "BACKEND",
                        "score": 72,
                        "scoredAt": "2026-07-09T10:40:00Z"
                    }
                ]
            }
        ]
    }
}
9. Get Resume by ID
GET /resumes/{id}

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "id": "a1b2c3d4-...",
        "fileName": "Ali_Resume.pdf",
        "filePath": "/uploads/Ali_Resume.pdf",
        "uploadedAt": "2026-07-09T10:35:00Z",
        "parsedAt": "2026-07-09T10:36:00Z",
        "isActive": true,
        "rawText": "Experienced Java developer..."
    }
}
Error Responses:

404: "Resume not found"

403: "You don't have permission to view this resume"
10. Delete Resume
DELETE /resumes/{id}

Headers: Authorization: Bearer <token>

Response (204 No Content):

Error Responses:

404: "Resume not found"
11. Score Resume
POST /resumes/{id}/score

Headers: Authorization: Bearer <token>

Request:
{
    "jobRole": "BACKEND"
}
Response (200 OK):
{
    "status": "success",
    "message": "Resume scored successfully",
    "data": {
        "resumeId": "a1b2c3d4-...",
        "jobRole": "BACKEND",
        "overallScore": 72,
        "strengths": [
            "Strong Java fundamentals",
            "Good SQL knowledge",
            "Project experience with REST APIs"
        ],
        "weaknesses": [
            "Missing microservices experience",
            "No cloud platform exposure",
            "Limited testing coverage"
        ],
        "suggestions": [
            "Add a personal project with Spring Boot + AWS",
            "Include unit test examples",
            "Highlight any CI/CD exposure"
        ],
        "scoredAt": "2026-07-09T10:40:00Z",
        "aiModelUsed": "gpt-4o"
    }
}
Error Responses:

404: "Resume not found"

400: "Resume text not extracted yet"

500: "AI service error"

12. Get Resume Scores History
GET /resumes/{id}/scores

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "resumeId": "a1b2c3d4-...",
        "scores": [
            {
                "jobRole": "BACKEND",
                "overallScore": 72,
                "scoredAt": "2026-07-09T10:40:00Z"
            },
            {
                "jobRole": "FRONTEND",
                "overallScore": 65,
                "scoredAt": "2026-07-09T11:00:00Z"
            }
        ]
    }
}
13. Get Best Scores (Dashboard)
GET /resumes/scores/best

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "bestScores": {
            "FRONTEND": 65,
            "BACKEND": 72,
            "DATA": 60,
            "UIUX": 58
        }
    }
}
🎯 Interview Endpoints
14. Start Interview Session
POST /interview/sessions

Headers: Authorization: Bearer <token>

Request:
{
    "jobRole": "BACKEND",
    "totalQuestions": 10
}
Response (201 Created):
{
    "status": "success",
    "message": "Session started successfully",
    "data": {
        "sessionId": "e5f6g7h8-...",
        "jobRole": "BACKEND",
        "totalQuestions": 10,
        "startTime": "2026-07-09T11:00:00Z",
        "currentQuestion": 1
    }
}
15. Get All Sessions
GET /interview/sessions

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "sessions": [
            {
                "id": "e5f6g7h8-...",
                "jobRole": "BACKEND",
                "overallScore": 82,
                "totalQuestions": 10,
                "completed": true,
                "startTime": "2026-07-09T11:00:00Z",
                "endTime": "2026-07-09T11:30:00Z"
            }
        ]
    }
}
16. Get Session Details
GET /interview/sessions/{id}

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "id": "e5f6g7h8-...",
        "jobRole": "BACKEND",
        "overallScore": 82,
        "totalQuestions": 10,
        "completed": true,
        "startTime": "2026-07-09T11:00:00Z",
        "endTime": "2026-07-09T11:30:00Z",
        "questions": [
            {
                "id": "q1w2e3r4-...",
                "question": "Explain @RestController vs @Controller",
                "userAnswer": "@RestController combines...",
                "aiScore": 85,
                "aiFeedback": "Excellent answer!",
                "answeredAt": "2026-07-09T11:05:00Z"
            }
        ]
    }
}
17. Generate Next Question
POST /interview/sessions/{id}/questions

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "questionId": "q1w2e3r4-...",
        "question": "Explain the difference between @RestController and @Controller in Spring Boot. When would you use one over the other?",
        "questionNumber": 3,
        "totalQuestions": 10,
        "generatedAt": "2026-07-09T11:01:00Z"
    }
}
Error Responses:

404: "Session not found"

400: "Session already completed"

18. Submit Answer
PUT /interview/sessions/{id}/questions/{questionId}

Headers: Authorization: Bearer <token>

Request:
{
    "answer": "@RestController is a convenience annotation that combines @Controller and @ResponseBody..."
}
Response (200 OK):
{
    "status": "success",
    "data": {
        "questionId": "q1w2e3r4-...",
        "aiScore": 85,
        "aiFeedback": "Excellent answer! You clearly understand the distinction. One improvement: mention that @RestController automatically serializes objects to JSON using HttpMessageConverter.",
        "answeredAt": "2026-07-09T11:05:00Z",
        "feedbackGeneratedAt": "2026-07-09T11:05:05Z",
        "progress": "3/10"
    }
}
19. End Session
POST /interview/sessions/{id}/end

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "message": "Session completed successfully",
    "data": {
        "sessionId": "e5f6g7h8-...",
        "overallScore": 82,
        "totalQuestions": 10,
        "answeredQuestions": 10,
        "averageScore": 82,
        "summary": "Great job! You scored above average in Backend interview."
    }
}
📊 Progress Endpoints
20. Get Dashboard Data
GET /progress/dashboard

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "stats": {
            "totalResumes": 5,
            "totalSessions": 8,
            "totalQuestions": 32,
            "averageResumeScore": 68,
            "averageInterviewScore": 76,
            "improvement": 12
        },
        "resumeScoreHistory": [
            { "date": "2026-07-01", "score": 55 },
            { "date": "2026-07-05", "score": 62 },
            { "date": "2026-07-09", "score": 72 }
        ],
        "roleBreakdown": {
            "FRONTEND": 65,
            "BACKEND": 72,
            "DATA": 60,
            "UIUX": 58
        },
        "recentSessions": [
            {
                "sessionId": "e5f6g7h8-...",
                "role": "BACKEND",
                "score": 82,
                "date": "2026-07-09T11:00:00Z"
            }
        ],
        "achievements": [
            {
                "title": "First Resume Scored!",
                "unlocked": true,
                "date": "2026-07-01"
            },
            {
                "title": "5 Interview Sessions Completed",
                "unlocked": true,
                "date": "2026-07-05"
            },
            {
                "title": "Improved Resume Score by 20%",
                "unlocked": true,
                "date": "2026-07-09"
            }
        ],
        "recommendations": [
            {
                "title": "Spring Boot Microservices",
                "type": "YouTube",
                "source": "Engineering Digest",
                "duration": "4 hours"
            },
            {
                "title": "AWS Cloud Practitioner",
                "type": "Course",
                "source": "Coursera",
                "duration": "20 hours"
            }
        ]
    }
}
21. Get Progress History
GET /progress/history?from=2026-07-01&to=2026-07-09

Headers: Authorization: Bearer <token>

Response (200 OK):
{
    "status": "success",
    "data": {
        "history": [
            {
                "metricType": "RESUME_SCORE",
                "metricValue": 55,
                "recordedAt": "2026-07-01T10:00:00Z",
                "notes": "Backend role"
            },
            {
                "metricType": "RESUME_SCORE",
                "metricValue": 72,
                "recordedAt": "2026-07-09T10:40:00Z",
                "notes": "Backend role"
            }
        ]
    }
}
📝 API Summary
#	Method	Endpoint	Description	Auth Required
1	POST	/auth/register	Register user	❌
2	POST	/auth/login	Login user	❌
3	POST	/auth/logout	Logout user	✅
4	GET	/users/me	Get current user	✅
5	PUT	/users/me	Update profile	✅
6	PUT	/users/me/password	Change password	✅
7	POST	/resumes/upload	Upload resume	✅
8	GET	/resumes/me	Get all user resumes	✅
9	GET	/resumes/{id}	Get resume by ID	✅
10	DELETE	/resumes/{id}	Delete resume	✅
11	POST	/resumes/{id}/score	Score resume	✅
12	GET	/resumes/{id}/scores	Get score history	✅
13	GET	/resumes/scores/best	Get best scores	✅
14	POST	/interview/sessions	Start session	✅
15	GET	/interview/sessions	Get all sessions	✅
16	GET	/interview/sessions/{id}	Get session details	✅
17	POST	/interview/sessions/{id}/questions	Generate question	✅
18	PUT	/interview/sessions/{id}/questions/{qId}	Submit answer	✅
19	POST	/interview/sessions/{id}/end	End session	✅
20	GET	/progress/dashboard	Get dashboard	✅
21	GET	/progress/history	Get history	✅
