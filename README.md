# Automated Resume Screener Backend API

This backend powers a recruitment workflow for candidates and recruiters. It supports user authentication, resume submission, AI-assisted resume parsing, job matching, and mock interview question generation.

## Features

- User registration and login for candidate and recruiter roles
- Resume submission through structured JSON or file upload (.pdf, .docx)
- AI-based resume parsing for autofill data
- Candidate job matching and scoring
- Recruiter job creation and mock interview question generation

## Tech Stack

- **Runtime**: Node.js + Express
- **Authentication**: JWT & bcryptjs
- **Uploads**: Multer
- **Parsing**: pdf-parse, mammoth
- **Database / ORM**: Sequelize (PostgreSQL)
- **Validation**: Zod
- **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=3000
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=postgres://user:password@dpg-xxx-a.render.com/dbname
```

### Run Locally

```bash
npm run dev
```

The API will be available at:

- `http://localhost:3000/api`
- Production URL: `https://automated-resume-screener-interview.onrender.com/api`

---

## Authentication

Most protected routes require a Bearer token in the request header:
`Authorization: Bearer <token>`

### POST /api/register
Create a new user account as either a `candidate` or `recruiter`.

**Request Body:**

```json
{
  "email": "candidate@example.com",
  "password": "password123",
  "role": "candidate"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Registration successful"
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### POST /api/login
Authenticate a user and receive a JWT token along with user profile data.

**Request Body:**

```json
{
  "email": "candidate@example.com",
  "password": "password123",
  "role": "candidate"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example_token_hash",
  "message": "Logged In successfully",
  "profile": {
    "email": "candidate@example.com",
    "role": "candidate",
    "hasResume": true
  },
  "cvDetails": {
    "targetRole": "Full Stack Engineer",
    "overallMatch": {
      "score": "88%",
      "remarks": "Strong candidate background.",
      "sectionScores": {
        "formatting": "90%",
        "keywords": "85%",
        "actionVerbs": "88%"
      }
    }
  }
}
```

---

## Candidate Endpoints

All candidate routes require:
- Header `Authorization: Bearer <token>`
- User account with role `candidate`

### PUT /api/candidate/resume
Save or update a structured resume payload.

**Request Body:**

```json
{
  "candidate": {
    "basics": {
      "fullName": "Alex Mercer",
      "jobTitle": "Full Stack Engineer",
      "email": "alex.mercer@example.com",
      "phone": [
        {
          "phone1": "+14155552671"
        }
      ],
      "nationality": [
        "American"
      ],
      "dob": "14/05/1995",
      "maritalStatus": "Single",
      "location": {
        "city": "San Francisco",
        "country": "United States"
      },
      "links": [
        {
          "label": "GitHub",
          "url": "https://github.com/alexmercer"
        }
      ],
      "fullAddress": "7 San Francisco, CA 94102",
      "summary": "Fullstack engineer with 5 years of experience building scalable web applications.",
      "totalYearsExperience": 5
    },
    "skills": {
      "technical": [
        "JavaScript",
        "Node.js",
        "TypeScript",
        "React"
      ],
      "toolsAndFrameworks": [
        "Express",
        "Docker",
        "Git"
      ]
    },
    "workExperience": [
      {
        "jobTitle": "Senior Software Engineer",
        "company": "TechCorp Solutions",
        "location": "San Francisco, CA",
        "startDate": "2022-01",
        "endDate": "Present",
        "highlights": [
          "Architected backend microservices handling high traffic volume.",
          "Led a team of 4 engineers to rebuild the core dashboard."
        ]
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "institution": "University of California, Berkeley",
        "startDate": "2015",
        "endDate": "2019",
        "honors": "Cum Laude",
        "gpa": "3.8"
      }
    ],
    "projects": [
      {
        "name": "DevFlow Analytics",
        "description": "An open-source telemetry dashboard for developer teams.",
        "technologiesUsed": [
          "React",
          "Node.js",
          "TailwindCSS"
        ],
        "link": "https://github.com/alexmercer/devflow"
      }
    ],
    "certifications": [
      {
        "title": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "issueDate": "2023-10"
      }
    ],
    "languages": [
      {
        "language": "English",
        "fluency": "Native"
      }
    ]
  }
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Resume successfully saved"
}
```

---

### POST /api/candidate/resume/file
Upload a resume file (.pdf or .docx) for automatic AI parsing and autofill data generation.

- **Content-Type**: `multipart/form-data`
- **Form Field**: `file`
- **Supported Formats**: `.pdf`, `.docx`
- **Maximum File Size**: 5 MB

**Example Usage (cURL):**

```bash
curl -X POST http://localhost:3000/api/candidate/resume/file \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/resume.pdf"
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "File Uploaded Successfully: ",
  "filename": "1784642457945-resume.pdf",
  "size": "1.20 MB",
  "autofillData": {
    "basics": {
      "fullName": "Alex Mercer",
      "jobTitle": "Full Stack Engineer",
      "email": "alex.mercer@example.com",
      "phone": [
        {
          "phone1": "+14155552671"
        }
      ],
      "nationality": [
        "American"
      ],
      "dob": "14/05/1995",
      "maritalStatus": "Single",
      "location": {
        "city": "San Francisco",
        "country": "United States"
      },
      "links": [
        {
          "label": "GitHub",
          "url": "https://github.com/alexmercer"
        }
      ],
      "fullAddress": "7 San Francisco, CA 94102",
      "summary": "Fullstack engineer with 5 years of experience building scalable web applications.",
      "totalYearsExperience": 5
    },
    "skills": {
      "technical": [
        "JavaScript",
        "Node.js",
        "TypeScript",
        "React"
      ],
      "toolsAndFrameworks": [
        "Express",
        "Docker",
        "Git"
      ]
    },
    "workExperience": [
      {
        "jobTitle": "Senior Software Engineer",
        "company": "TechCorp Solutions",
        "location": "San Francisco, CA",
        "startDate": "2022-01",
        "endDate": "Present",
        "highlights": [
          "Architected backend microservices handling high traffic volume.",
          "Led a team of 4 engineers to rebuild the core dashboard."
        ]
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "institution": "University of California, Berkeley",
        "startDate": "2015",
        "endDate": "2019",
        "honors": "Cum Laude",
        "gpa": "3.8"
      }
    ],
    "projects": [
      {
        "name": "DevFlow Analytics",
        "description": "An open-source telemetry dashboard for developer teams.",
        "technologiesUsed": [
          "React",
          "Node.js",
          "TailwindCSS"
        ],
        "link": "https://github.com/alexmercer/devflow"
      }
    ],
    "certifications": [
      {
        "title": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "issueDate": "2023-10"
      }
    ],
    "languages": [
      {
        "language": "English",
        "fluency": "Native"
      }
    ],
    "updatedAt": "2026-08-07T00:00:00.000Z"
  }
}
```

---

### GET /api/candidate/resume/feedback
Retrieve AI-generated resume feedback for the authenticated candidate.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "targetRole": "Full Stack Engineer",
    "overallMatch": {
      "score": "88%",
      "remarks": "Strong background in full-stack web development and scalable backend architecture.",
      "sectionScores": {
        "formatting": "90%",
        "keywords": "85%",
        "actionVerbs": "88%"
      }
    },
    "keyHighlights": [
      "Solid academic foundation in Computer Science with a 3.8 GPA",
      "Demonstrated team leadership and dashboard development experience"
    ],
    "actionableFeedback": [
      "Add quantifiable metrics to project outcomes",
      "Elaborate on specific cloud infrastructure tools utilized"
    ]
  }
}
```

---

### GET /api/candidate/jobs/score
Retrieve job matches and relevance scores for the candidate based on skill keyword matching.

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "overallScore": 85,
      "skillsMatched": {
        "JavaScript": 30,
        "React": 35,
        "Node.js": 20
      },
      "missingSkills": {
        "GraphQL": 15
      },
      "job": {
        "id": "001",
        "jobTitle": "Senior Frontend Engineer",
        "companyName": "TechCorp Solutions",
        "jobDescription": "We are seeking a Senior Frontend Engineer proficient in React and Node.js to scale our products.",
        "salaryRange": {
          "min": 125000,
          "max": 160000
        },
        "location": "San Francisco, CA",
        "jobType": "Remote",
        "updatedAt": "2026-08-07T00:00:00.000Z"
      }
    }
  ]
}
```

---

### GET /api/candidate/jobs/:jobId/questions
Fetch recruiter-assigned mock interview questions for a specific job.

**Response (200 OK):**

```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "category": "React State Management",
      "question": "How do you handle global state management and prevent unnecessary re-renders in a complex React application?",
      "context": "Evaluates hands-on optimization techniques and knowledge of React context and state selectors.",
      "hints": [
        "Discuss useMemo, useCallback, and atomic state libraries."
      ],
      "evaluationRubric": {
        "scoringScale": "1-5",
        "levels": {
          "1": "Shows minimal understanding of React rendering mechanics.",
          "2": "Understands basic useState and props passing.",
          "3": "Provides a working basic context setup.",
          "4": "Formulates optimized rendering strategies using hooks.",
          "5": "Demonstrates advanced architecture with selectors and custom middleware."
        }
      }
    }
  ]
}
```

---

## Recruiter Endpoints

All recruiter routes require:
- Header `Authorization: Bearer <token>`
- User account with role `recruiter`

### POST /api/recruiter/jobs
Create a new job posting. Keywords for matching are automatically generated via AI based on the job description.

**Request Body:**

```json
{
  "jobTitle": "Senior Frontend Engineer",
  "companyName": "TechCorp Solutions",
  "jobDescription": "Build and maintain scalable frontend applications using React, TypeScript, and Node.js.",
  "salaryRange": {
    "min": 115000,
    "max": 155000
  },
  "location": "Remote",
  "jobType": "Full-time"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Recruiter job created successfully"
}
```

---

### GET /api/recruiter/jobs
Fetch all jobs created by the authenticated recruiter.

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Query successful",
  "jobs": [
    {
      "jobTitle": "Senior Frontend Engineer",
      "companyName": "TechCorp Solutions",
      "jobDescription": "Build and maintain scalable frontend applications using React, TypeScript, and Node.js.",
      "salaryRange": {
        "min": 115000,
        "max": 155000
      },
      "jobType": "Remote",
      "location": "Remote",
      "updatedAt": "2026-08-07T00:00:00.000Z"
    }
  ]
}
```

---

### GET /api/recruiter/jobs/:jobId/questions
Generate AI-based mock interview questions tailored to a specific job posting.

**Response (200 OK):**

```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "category": "Frontend Architecture",
      "question": "How do you implement micro-frontends to allow independent team deployments?",
      "context": "Evaluates architectural decision-making for large-scale enterprise applications.",
      "hints": [
        "Mention module federation and asset isolation."
      ],
      "evaluationRubric": {
        "scoringScale": "1-5",
        "levels": {
          "1": "Unfamiliar with micro-frontend concepts.",
          "2": "Understands iframe based isolation.",
          "3": "Explains build-time integration.",
          "4": "Details Webpack Module Federation setup.",
          "5": "Architects resilient, independently versioned runtime integration."
        }
      }
    }
  ]
}
```

---

### POST /api/recruiter/jobs/:jobId/questions
Save recruiter-provided or customized interview questions for a specific job.

**Request Body:**

```json
{
  "questions": [
    {
      "id": "q1",
      "category": "SIEM & Log Analysis",
      "question": "How do you construct a SIEM search query in Splunk to detect brute-force login attempts?",
      "context": "Evaluates hands-on log analysis skills using industry-standard tools.",
      "hints": [
        "Focus on high volume of failed authentication events in a short time window."
      ],
      "evaluationRubric": {
        "scoringScale": "1-5",
        "levels": {
          "1": "Shows minimal understanding of log search syntax.",
          "2": "Understands basic searching by keyword.",
          "3": "Provides a working basic aggregation query.",
          "4": "Formulates an accurate, optimized query with time thresholds.",
          "5": "Demonstrates advanced query crafting with statistical anomalies."
        }
      }
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Questions successfully saved"
}
```

---

## Error Handling & Response Formats

The API returns consistent JSON responses for error states.

### Standard Error Structure

```json
{
  "success": false,
  "error": "Description of the issue"
}
```

### Validation Error Structure (Zod Validation Failure)

```json
{
  "success": false,
  "message": "Validation failed for candidate payload",
  "errors": {
    "candidate.basics.fullName": [
      "Name is required"
    ]
  }
}
```

### Common HTTP Status Codes

- **200 OK**: Request completed successfully.
- **201 Created**: Resource successfully created.
- **400 Bad Request**: Invalid input payload or file upload failure.
- **401 Unauthorized**: Missing, invalid, or expired authentication token.
- **403 Forbidden**: User role lacks permission for the endpoint.
- **404 Not Found**: Requested resource does not exist.
- **500 Internal Server Error**: Unexpected server error.
