# AI-Powered Career Coach Platform
## Project Planning Document
### Intern: [Your Name] | Supervisor: Ammar Ahmad | Tynovate Studio

---

## 1. Project Overview
**Objective:** Build an AI-enhanced web platform that helps job seekers improve their resumes, practice interviews, and track career progress using intelligent automation.

**Target Users:** Fresh graduates, career switchers, and professionals seeking job role optimization.

**Core Value Proposition:** Personalized, AI-driven career coaching accessible 24/7, eliminating the cost and scheduling barriers of traditional coaching.

---

## 2. Scope & Feature Breakdown

### Phase 1: Core MVP (Weeks 1-5)
- [ ] User Authentication (JWT-based)
- [ ] Resume Upload & Parsing (PDF/DOCX)
- [ ] AI Resume Scoring (0-100)
- [ ] Strength/Weakness Analysis
- [ ] Job Role Targeting (4 predefined roles)
- [ ] AI Interview Question Generation
- [ ] Answer Submission & AI Feedback
- [ ] Progress Dashboard

### Phase 2: Enhancements (Weeks 6-8)
- [ ] Learning Roadmap Recommendations
- [ ] Progress History Visualization
- [ ] Role-Specific Resume Tailoring
- [ ] Deployment to Cloud (AWS/GCP/Azure)

---

## 3. Technology Stack (Finalized)
| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | React.js + Tailwind CSS | Industry standard, component reusability |
| Backend | Java + Spring Boot | Enterprise-grade, FAST curriculum alignment |
| Database | PostgreSQL | Relational data, JSONB support, strong ACID compliance |
| AI Integration | OpenAI API (GPT-4o) | Best-in-class NLP for resume & interview |
| Authentication | JWT + Spring Security | Stateless, scalable |
| Version Control | Git + GitHub | Professional collaboration standard |

---

## 4. Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Spring Boot learning curve | High | Dedicated 2 hours daily for tutorials; start with basic CRUD |
| AI API costs | Medium | Use OpenAI with token limits; implement caching |
| Timeline slippage | High | Build a "drop" feature for non-critical modules |
| PostgreSQL setup issues | Low | Use Docker for local development |

---

## 5. Success Metrics
- [ ] Resume scores increase by 20% on average after user improvement suggestions
- [ ] Interview practice module generates role-specific questions with >90% relevance
- [ ] Dashboard loads within 2 seconds
- [ ] Zero critical bugs in production deployment

---

## 6. Week-by-Week Plan (Detailed)

### Week 1: Foundation ✅
- Set up GitHub repo with proper branching (main/develop)
- Design database schema (ERD attached)
- Plan REST API endpoints
- Initialize Spring Boot project
- Connect to PostgreSQL locally

### Week 2: User Authentication
- Implement Spring Security + JWT
- Build register/login endpoints
- Create React login/register pages
- Store user data in PostgreSQL

### Week 3: Backend Core
- Build User CRUD operations
- Implement file upload (resume PDF/DOCX)
- Create Resume entity and service layer
- Design response DTOs

### Week 4: AI Resume Scoring
- Integrate OpenAI API
- Build ResumeScoreService
- Implement prompt engineering for scoring
- Store scores and feedback in DB
- Create API endpoints for frontend

### Week 5: Job Role Targeting
- Build job role enums (FRONTEND, BACKEND, DATA, UIUX)
- Implement role-specific analysis
- Connect role selection to resume scoring pipeline
- Build role-based recommendation engine

### Week 6: Interview Practice
- Build Question generation service (AI)
- Create Answer submission endpoint
- Implement AI feedback and scoring
- Store interview sessions and history

### Week 7: Dashboard & Integration
- Build Progress tracking endpoints
- Implement history aggregation
- Frontend integration (connect all features)
- End-to-end testing

### Week 8: Documentation & Polish
- Write API documentation (Swagger/OpenAPI)
- Create user guide
- Prepare deployment configuration
- Final presentation materials
- Demo video recording

## 7. Resources & Learning Path
- **Spring Boot:** Engineering Digest playlist (47 videos) - 2 videos daily
- **JPA/Hibernate:** Telusko Spring Boot series
- **PostgreSQL:** Official docs + SQL basics (already covered)
- **React:** Basic knowledge sufficient; will learn on demand
- **AI Integration:** OpenAI Python/Java SDK documentation
