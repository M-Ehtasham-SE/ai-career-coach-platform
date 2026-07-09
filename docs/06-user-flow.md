# User Flow Diagrams

## 1. User Registration Flow

```mermaid
flowchart TD
    A[Landing Page] --> B[Click Get Started]
    B --> C[Registration Form]
    C --> D[Enter Name, Email, Password]
    D --> E[Email Verification]
    E --> F[Dashboard]
```

---

## 2. Resume Scoring Flow

```mermaid
flowchart TD
    A[Dashboard] --> B[Upload Resume]
    B --> C[Select PDF/DOCX]
    C --> D[Select Job Role]
    D --> E[Click Analyze]
    E --> F[AI Resume Analysis]
    F --> G[Resume Score]
    G --> H[Strengths]
    G --> I[Weaknesses]
    G --> J[Improvement Suggestions]
    J --> K[Save to History]
```

---

## 3. Interview Practice Flow

```mermaid
flowchart TD
    A[Dashboard] --> B[Practice Interview]
    B --> C[Select Job Role]
    C --> D[Create Interview Session]
    D --> E[AI Generates Question]
    E --> F[User Submits Answer]
    F --> G[AI Evaluation]
    G --> H[Score & Feedback]
    H --> I{More Questions?}
    I -->|Yes| E
    I -->|No| J[Session Summary]
```

---

## 4. Progress Dashboard Flow

```mermaid
flowchart TD
    A[Dashboard] --> B[Progress]
    B --> C[Statistics]
    B --> D[Resume Score History]
    B --> E[Role-wise Performance]
    B --> F[Achievements]
    B --> G[Learning Recommendations]
```

---

## 5. Profile Management Flow

```mermaid
flowchart TD
    A[Dashboard] --> B[Profile]
    B --> C[View Profile]
    C --> D[Edit Profile]
    C --> E[Change Password]
    C --> F[Account Settings]
```

---

# Complete User Journey

```mermaid
flowchart LR
    A[Landing Page]
    --> B[Register/Login]
    --> C[Dashboard]
    --> D[Resume Analysis]

    C --> E[Interview Practice]
    C --> F[Progress Dashboard]
    C --> G[Profile Management]

    D --> H[AI Feedback]
    E --> I[Interview Report]
    H --> F
    I --> F
```

---

# Critical User Goals

- Register or log in within **60 seconds**.
- Upload a resume within **30 seconds**.
- Receive AI analysis within **15 seconds**.
- Practice AI interviews with instant feedback.
- Track long-term progress and performance.

---

# Potential User Drop-Off Points

| Stage | Potential Issue | Solution |
|--------|-----------------|----------|
| Registration | Too many fields | Keep only Name, Email, and Password |
| Resume Upload | Unsupported file format | Support PDF and DOCX with clear validation |
| AI Processing | Long waiting time | Display loading animation and progress indicator |
| Feedback | Difficult to understand | Use simple language and actionable suggestions |