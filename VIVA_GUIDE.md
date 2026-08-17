# 🎓 Master Viva & Project Defense Guide
## AI-Powered Career Coach Platform

**Project Author:** Muhammad Ehtasham  
**Degree / Semester:** FAST-NUCES (4th Semester)  
**Company / Studio:** Tynovate Studio  
**Tech Stack:** Spring Boot 3 (Java 21) + React 18 (Vite + Tailwind) + PostgreSQL 16 + OpenAI API + Render & Netlify  

---

## 📑 Table of Contents
1. [⚡ 60-Second Elevator Pitch (How to Introduce to Teachers)](#1-60-second-elevator-pitch)
2. [🗺️ High-Level System Architecture](#2-high-level-system-architecture)
3. [🛠️ Tech Stack & Why We Chose It](#3-tech-stack--why-we-chose-it)
4. [🔍 Module-by-Module Technical Explanation](#4-module-by-module-technical-explanation)
5. [🗄️ Database Schema & Entity Relationships](#5-database-schema--entity-relationships)
6. [🔐 Security, JWT & Authentication Flow](#6-security-jwt--authentication-flow)
7. [🤖 AI Engine & Fallback Mechanism](#7-ai-engine--fallback-mechanism)
8. [💳 EasyPaisa Payment & Subscription System](#8-easypaisa-payment--subscription-system)
9. [☁️ Production Deployment (Render + Netlify)](#9-production-deployment-render--netlify)
10. [❓ Top 35 Viva Questions & Answers](#10-top-35-viva-questions--answers)
11. [🎬 Recommended Live Demo Sequence](#11-recommended-live-demo-sequence)

---

<a id="1-60-second-elevator-pitch"></a>
## 1. ⚡ 60-Second Elevator Pitch (How to Introduce to Teachers)

> **Say this when the teacher asks: *"Tell us about your project"***

*"Respected Teachers, my project is the **AI-Powered Career Coach Platform**. It is a full-stack, enterprise-grade SaaS application designed to bridge the gap between job seekers and hiring managers.*

*Students and graduates often struggle to get interview calls because their CVs lack role-specific keywords, ATS compatibility, or quantified achievements. Our platform solves this by offering:*
1. ***AI Resume Scoring & Role Targeting*** — *Parses PDF/DOCX resumes using Apache Tika and scores them 0–100 against target roles (Frontend, Backend, Data Science, UI/UX) using OpenAI GPT-4o.*
2. ***Interactive AI Technical Interviews*** — *Generates role-specific, difficulty-graded technical questions and provides real-time scoring on student answers.*
3. ***Career Readiness Index & Progress Dashboard*** — *Visualizes candidate growth trends over time using interactive graphs.*
4. ***Local Monetization Engine*** — *Enforces a 3-scoring Free tier quota integrated with EasyPaisa payment for 30-day Premium activation.*

*The backend is built with **Spring Boot 3 (Java 21)** deployed on **Render Docker**, the database is **PostgreSQL 16**, and the frontend is a modern **React 18** single-page application deployed on **Netlify**."*

---

<a id="2-high-level-system-architecture"></a>
## 2. 🗺️ High-Level System Architecture

```
[ User Browser ] ──── HTTPS ────► [ Netlify (React 18 SPA) ]
                                          │
                                   REST API Calls (JSON)
                                          │
                                          ▼
                         [ Render (Spring Boot 3 Web Service) ]
                                  │               │
                     JPA / Hibernate              │ HTTP REST
                                  ▼               ▼
                        [ PostgreSQL 16 ]   [ OpenAI GPT-4o API ]
```

---

<a id="3-tech-stack--why-we-chose-it"></a>
## 3. 🛠️ Tech Stack & Why We Chose It

| Layer | Technology | Why We Chose It |
|:---|:---|:---|
| **Backend** | Spring Boot 3.2.4 (Java 21) | Production-ready, enterprise security, strict type-checking, dependency injection |
| **Frontend** | React 18 + Vite | Lightning-fast HMR, component reusability, virtual DOM performance |
| **Styling** | Vanilla CSS + Tailwind CSS | Custom dark Navy/Teal palette, responsive grid, zero runtime overhead |
| **Database** | PostgreSQL 16 | ACID-compliant relational DB, strong JSON and UUID support |
| **Security** | Spring Security 6 + JWT | Stateless, scalable authentication without server session storage |
| **Text Extraction** | Apache Tika | Robust text parsing from complex PDF & DOCX resume files |
| **AI Integration** | OpenAI Chat API (`gpt-4o-mini`) | State-of-the-art natural language understanding and JSON formatting |
| **Deployment** | Netlify (Frontend) + Render (Backend) | Global CDN for static assets + Dockerized Spring Boot cloud container |

---

<a id="4-module-by-module-technical-explanation"></a>
## 4. 🔍 Module-by-Module Technical Explanation

### Module 1: Authentication & User Management
- **Flow:** User submits email & password → `AuthService` validates uniqueness → `PasswordEncoder` (BCrypt with salt) hashes password → User persisted in DB → `JwtService` signs a 24-hour HMAC-SHA256 JWT token.
- **Frontend Storage:** Token stored in `localStorage` and auto-attached via `axiosClient` request interceptor (`Authorization: Bearer <token>`).

### Module 2: Resume Parsing & Storage
- **Flow:** User uploads PDF/DOCX → `ResumeService` passes byte stream to **Apache Tika** → Tika extracts raw plain text → File saved to local/tmp storage → Resume record created with `raw_text` and file metadata.

### Module 3: AI Resume Scoring & Role Targeting
- **Flow:** User selects target role → `ResumeScoreService` checks quota → Passes `raw_text` and `jobRole` prompt to `OpenAiService` → OpenAI responds with enforced JSON format:
  ```json
  {
    "overallScore": 85,
    "strengths": ["...", "...", "...", "...", "..."],
    "weaknesses": ["...", "...", "...", "...", "..."],
    "suggestions": ["...", "...", "...", "...", "..."]
  }
  ```
- **Fallback Engine:** If OpenAI key is absent, `generateDynamicFallback()` evaluates keyword density, word count, and metric indicators to calculate a realistic score dynamically.

### Module 4: AI Technical Interview System
- **Flow:** User selects role & difficulty (*Easy, Medium, Hard*) → `InterviewService` prompts AI for 5 technical questions → User submits answers → AI evaluates correctness and returns numerical score (0–100) + feedback.

### Module 5: Progress Analytics & Dashboard
- **Flow:** Computes **Career Readiness Index (CRI)** weighted:
  $$\text{CRI} = (0.6 \times \text{Avg Resume Score}) + (0.4 \times \text{Avg Interview Score})$$
- Visualized using Recharts line & bar charts.

---

<a id="5-database-schema--entity-relationships"></a>
## 5. 🗄️ Database Schema & Entity Relationships

- **`users`**: `id` (UUID PK), `email` (Unique), `password_hash`, `full_name`, `role` (USER/ADMIN), `subscription_tier` (FREE/PREMIUM), `subscription_expires_at`, `easypaisa_trx_id`.
- **`resumes`**: `id` (UUID PK), `user_id` (FK -> users.id), `filename`, `file_type`, `file_size`, `raw_text`, `created_at`.
- **`resume_scores`**: `id` (UUID PK), `resume_id` (FK -> resumes.id), `target_role`, `overall_score`, `strengths` (JSON), `weaknesses` (JSON), `suggestions` (JSON), `scored_at`.
- **`interview_sessions`**: `id` (UUID PK), `user_id` (FK -> users.id), `target_role`, `difficulty`, `status`, `created_at`.
- **`interview_answers`**: `id` (UUID PK), `session_id` (FK -> interview_sessions.id), `question_text`, `user_answer`, `score`, `feedback`.

---

<a id="6-security-jwt--authentication-flow"></a>
## 6. 🔐 Security, JWT & Authentication Flow

1. **Why Stateless JWT?** No server-side session memory is required. Scales horizontally across cloud instances.
2. **CORS Security:** `SecurityConfig.java` dynamically reads `FRONTEND_URL` environment variable to accept requests from `https://artificialintelligencecareercoach.netlify.app/` while blocking unauthorized origins.
3. **Pre-flight Handling:** `HttpMethod.OPTIONS` requests are explicitly permitted for browser pre-flight checks.

---

<a id="7-ai-engine--fallback-mechanism"></a>
## 7. 🤖 AI Engine & Fallback Mechanism

- **OpenAI Model:** `gpt-4o-mini` (configured via `OPENAI_MODEL`).
- **Structured JSON Format:** Requests send `"response_format": {"type": "json_object"}`.
- **Fail-Safe Heuristic Engine:** If API quota fails or key is missing, `generateDynamicFallback` analyzes text length, keyword occurrences, and metrics so the platform remains 100% functional.

---

<a id="8-easypaisa-payment--subscription-system"></a>
## 8. 💳 EasyPaisa Payment & Subscription System

- **Free Tier Quota:** Enforced maximum 3 resume scorings per calendar month in `ResumeScoreService.java`.
- **EasyPaisa Receiver Account:** `03229240140` (Account Title: `Muhammad Ehtasham`).
- **Activation:** User submits 11-digit Trx ID via `EasyPaisaPaymentModal.jsx` → `POST /subscription/easypaisa` upgrades user `subscription_tier` to `PREMIUM` for 30 days.

---

<a id="9-production-deployment-render--netlify"></a>
## 9. ☁️ Production Deployment (Render + Netlify)

1. **Frontend (Netlify):** Built with `npm run build`, output directory `dist`, routing handled by `_redirects` (`/* /index.html 200`).
2. **Backend (Render Docker):** Multi-stage `Dockerfile` compiles Spring Boot JAR using Maven OpenJDK 21 and runs on Temurin JRE 21.
3. **Database URL Sanitizer:** [`DatabaseConfig.java`](file:///d:/ai-career-coach-platform/backend/src/main/java/com/aicareercoach/config/DatabaseConfig.java) automatically converts Render's `postgresql://` URIs to valid `jdbc:postgresql://` strings.

---

<a id="10-top-35-viva-questions--answers"></a>
## 10. ❓ Top 35 Viva Questions & Answers

### 🟢 Category A: General & Architecture

**Q1: What is the main purpose of your project?**  
*Answer:* It is an AI-powered SaaS career development platform that analyzes candidate CVs against target roles, provides structured feedback, conducts simulated technical interviews, and tracks career readiness over time.

**Q2: Why did you choose a decoupled (frontend/backend split) architecture?**  
*Answer:* Separation of concerns. The React frontend focuses on UI performance and user experience, while the Spring Boot backend manages business logic, AI integration, and database security. They communicate via RESTful JSON APIs.

**Q3: How do the frontend and backend communicate in production?**  
*Answer:* Over HTTPS REST API calls. Axios sends JSON requests from Netlify to Render endpoints attached with JWT Bearer tokens in the HTTP Authorization header.

---

### 🟡 Category B: Backend & Spring Boot

**Q4: Why Spring Boot over Node.js/Express for the backend?**  
*Answer:* Spring Boot provides strong compile-time type safety, built-in enterprise security (Spring Security), robust ORM with Hibernate/JPA, and excellent multi-threading support.

**Q5: What design patterns did you use in Spring Boot?**  
*Answer:* 
- **MVC / Layered Architecture:** Controller -> Service -> Repository -> Entity.
- **Dependency Injection / IoC:** Managed spring beans.
- **Builder Pattern:** Used in `User.java` and DTOs.
- **Singleton Pattern:** Spring service beans.

**Q6: How do you extract text from PDF and Word documents?**  
*Answer:* Using the **Apache Tika** library. Tika auto-detects mime types and extracts plain text from binary PDF/DOCX file streams.

**Q7: How does Spring Security handle authentication?**  
*Answer:* Using a custom `JwtAuthenticationFilter` extending `OncePerRequestFilter`. It intercepts every HTTP request, extracts the JWT header, validates signature and expiration, and populates the `SecurityContextHolder`.

**Q8: What happens if a user inputs an invalid password during login?**  
*Answer:* `AuthenticationManager.authenticate()` throws a `BadCredentialsException`, which is caught and returned as a 401 Unauthorized HTTP response with a clean JSON error message.

---

### 🔵 Category C: Database & Hibernate

**Q9: Why PostgreSQL instead of MySQL or MongoDB?**  
*Answer:* PostgreSQL is an advanced relational database with excellent support for UUID primary keys, JSON column types, ACID compliance, and high concurrency.

**Q10: What is the difference between `@OneToMany` and `@ManyToOne` in your entities?**  
*Answer:* In `User.java` and `Resume.java`, one User can have many Resumes (`@OneToMany`), while each Resume belongs to exactly one User (`@ManyToOne`).

**Q11: How do you prevent SQL Injection?**  
*Answer:* Spring Data JPA uses parameterized PreparedStatements under the hood for all repository queries, eliminating raw string concatenation.

**Q12: How did you fix the Render PostgreSQL JDBC URL error?**  
*Answer:* Render passes `DATABASE_URL` starting with `postgresql://`. JDBC drivers require `jdbc:postgresql://`. I wrote a custom `DatabaseConfig.java` bean that automatically sanitizes the URL and prepends `jdbc:`.

---

### 🟣 Category D: Frontend & React

**Q13: Why did you use Vite instead of Create React App (CRA)?**  
*Answer:* Vite uses ES modules during development for instant server start and lightning-fast HMR (Hot Module Replacement), and bundles with Rollup for optimal production assets.

**Q14: How do you handle protected routes in React?**  
*Answer:* Using a custom `<ProtectedRoute>` component wrapping react-router-dom routes. It checks `AuthContext` for a valid JWT token; if missing, it redirects to `/login`.

**Q15: How did you fix 404 errors on page refresh on Netlify?**  
*Answer:* Single Page Applications (SPAs) route everything on the client side. I added a `_redirects` file (`/* /index.html 200`) and `netlify.toml` redirect rules so Netlify routes all deep paths back to `index.html`.

**Q16: How is user state managed across components?**  
*Answer:* Using React Context API (`AuthContext`), storing authentication status, token, and user details globally.

---

### 🔴 Category E: AI & Monetization

**Q17: Which OpenAI API model are you using?**  
*Answer:* `gpt-4o-mini` (or `gpt-4o`), utilizing the Chat Completions endpoint (`/v1/chat/completions`) with enforced JSON output.

**Q18: What happens if OpenAI API is down or key is missing?**  
*Answer:* The platform gracefully degrades to a built-in **Dynamic Heuristic Engine** (`generateDynamicFallback`) that analyzes document word count, keyword density, and metrics to calculate a realistic score.

**Q19: How is the Free plan limit enforced?**  
*Answer:* `ResumeScoreService.java` checks `subscriptionService.getStatus()` before scoring. If a FREE user exceeds 3 scorings in the current calendar month, it blocks execution and prompts for EasyPaisa upgrade.

**Q20: How does EasyPaisa payment activation work?**  
*Answer:* The user sends PKR 500 to EasyPaisa number `03229240140` and submits the Trx ID via `EasyPaisaPaymentModal.jsx`. `POST /subscription/easypaisa` sets `subscription_tier` to `PREMIUM` for 30 days.

---

<a id="11-recommended-live-demo-sequence"></a>
## 11. 🎬 Recommended Live Demo Sequence

Follow these exact steps during your presentation:

1. **Step 1: Landing Page Showcase (30 seconds)**
   - Show `https://artificialintelligencecareercoach.netlify.app/`.
   - Highlight the Navy/Teal design, live score gauge (85/100), metrics, features, and pricing table.

2. **Step 2: User Registration & Dashboard (30 seconds)**
   - Click "Get Started Free" -> Register a new student account.
   - Show the Dashboard showing "FREE PLAN (3 scorings limit)".

3. **Step 3: Upload Resume & AI Score (60 seconds)**
   - Upload a sample PDF resume -> Select **Backend Developer** -> Click **Analyze & Score**.
   - Show 0-100 score, 5 Strengths, 5 Weaknesses, and 5 Actionable Suggestions.

4. **Step 4: AI Interview Practice (60 seconds)**
   - Go to Interview Practice -> Select **Backend Developer** -> Difficulty: **Medium**.
   - Answer a question -> Submit -> Show instant AI score & feedback.

5. **Step 5: Progress Analytics & EasyPaisa Upgrade (60 seconds)**
   - Show the Progress Dashboard with visual graphs and Career Readiness Index.
   - Click "Upgrade via EasyPaisa (03229240140)" -> Enter Trx ID `TRX-948271` -> Show instant Premium activation!

---

**Best of luck with your Project Defense, Muhammad Ehtasham! You've built a stellar, production-grade application! 🌟**
