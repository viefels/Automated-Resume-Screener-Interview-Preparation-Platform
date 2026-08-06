# Automated Resume Screener Backend API

This backend powers a recruitment workflow for candidates and recruiters. It supports user authentication, resume submission, AI-assisted resume parsing, job matching, and mock interview question generation.

## Features

- User registration and login for candidate and recruiter roles
- Resume submission through structured JSON or file upload
- AI-based resume parsing for autofill data
- Candidate job matching and scoring
- Recruiter job creation and mock interview question generation

## Tech stack

- Node.js + Express
- JWT authentication
- Multer for file uploads
- PDF/DOCX parsing
- JSON-based local data storage
- Fuse.js for matching
- Zod for validation

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Environment variables

Create a .env file in the project root with at least:

```env
PORT=3000
JWT_SECRET=your-secret-key
```

### Run locally

```bash
npm run dev
```

The API will be available at:

- https://automated-resume-screener-interview.onrender.com/api

- http://localhost:3000/api


## Authentication

Most protected routes require a Bearer token.

### POST /api/register
Create a new account.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "candidate" //or can be recruiter
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful"
}
```

### POST /api/login
Authenticate a user and receive a JWT.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "candidate"
}
```

Response:

```json
{
  "success": true,
  "token": "<jwt-token>",
  "message": "Logged In successfully",
  "profile": {
    "email": "user@example.com",
    "role": "candidate",
    "hasCv": false
  },
  "cvDetails": null
}
```

## Candidate endpoints

All candidate routes require:

- Authorization: Bearer <token>
- A user whose role is candidate

### PUT /api/candidate/resume
Save a structured resume payload.

Example body:

```json
{
  "candidate": {
    "basics": {
      "fullName": "Alex Mercer",
      "jobTitle": "Full Stack Engineer",
      "email": "alex.mercer@example.com",
      "phone": [
        { "phone1": "+14155552671" }
      ],
      "nationality": ["American"],
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
      "fullAddress": "7San Francisco, CA 94102",
      "summary": "Fullstack engineer snsk....",
      "totalYearsExperience": 5
    },
    "skills": {
      "technical": ["JavaScript", "etc"],
      "toolsAndFrameworks": ["React", "etc"]
    },
    "workExperience": [
      {
        "jobTitle": "Senior Software Engineer",
        "company": "TechCorp Solutions",
        "location": "San Francisco, CA",
        "startDate": "01/2022",
        "endDate": "Present",
        "highlights": [
          "array of strings highlights",
          "Led a team of 4 engineers to rebuild the core dashboard."
        ]
      },

    ],
    "education": [
      {
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "institution": "University of California, Berkeley",
        "startDate": "09/2015",
        "endDate": "05/2019",
        "honors": "Cum Laude",
        "gpa": "3.8"
      }
    ],
    "projects": [
      {
        "name": "DevFlow Analytics",
        "description": "An open-source telemetry ...",
        "technologiesUsed": ["React", "Node.js", "TailwindCSS"],
        "link": "https://github.com/alexmercer/devflow"
      }
    ],
    "certifications": [
      {
        "title": "AWS Certified Solutions Architect",
        "issuer": "Amazon",
        "issueDate": "10/2023"
      }
    ],
    "languages": [
      {
        "language": "English",
        "fluency": "Native"
      }
    ],
    "feedback": {}
  }
}
```

Success response:

```json
{
  "success": true,
  "message": "Resume successfully saved"
}
```

### POST /api/candidate/resume/file
Upload a resume file for AI parsing.

- Form field name: file
- Supported formats: .pdf, .docx
- Maximum size: 5 MB

Example:

```bash
curl -X POST http://localhost:3000/api/candidate/resume/file \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/resume.pdf"
```

Success response:

```json
{
  "success": true,
  "message": "File Uploaded Successfully: ",
  "filename": "resume.pdf",
  "size": "1.20 MB",
  "autofillData": {"same data as PUT /api/candidate/resume"}
}
```

### GET /api/candidate/resume/feedback
Retrieve resume feedback information for the authenticated candidate.

```json
{
  "success": true,
  "data": {
      "targetRole": "Data Scientist",
      "overallMatch": {
        "score": "88%",
        "remarks": "Strong background in data science etc.",
        "sectionScores": {
          "formatting": "90%",
          "keywords": "85%",
          "actionVerbs": "88%"
        }
      },
      "keyHighlights": [
        "array of strings feedbacks",
        "e.g Solid academic foundation in Data Science with a 3.85 GPA"
      ],
      "actionableFeedback": [
        "array of strings feedbacks"
      ]
    }
}
```


### GET /api/candidate/jobs/score
Get job matches and score results for the candidate.

response
```json
{
  "overallScore": 80, 
  "skillsMatched":{
    "React": 20
  },  
  "missingSkills":{
    "Html": 20
  }, 
  "job": {
    "jobTitle": "Cybersecurity Engineer",
    "companyName": "Shield Security",
    "primarySkills": [
      "Python", "etc"
    ],
    "jobDescription": "We are looking for....",
    "salaryRange": {
      "min": 125000,
      "max": 160000
    },
    "location": "Seattle, WA"
  }
}
```

### GET /api/candidate/jobs/:jobId/questions
Fetch interview questions for a specific job.

## Recruiter endpoints

All recruiter routes require:

- Authorization: Bearer <token>
- A user whose role is recruiter

### POST /api/recruiter/jobs
Create a job posting.

Request body:

```json
{
  "jobTitle": "Software Engineer",
  "companyName": "Example Inc",
  "primarySkills": ["Node.js", "Express", "PostgreSQL"],
  "jobDescription": "Build and maintain backend services for a SaaS platform.",
  "salaryRange": {
    "min": 115000,
    "max": 155000
  },
  "location": "Remote"
}
```

Response:

```json
{
  "success": true,
  "message": "Recruiter job created successfully"
}
```

### GET /api/recruiter/jobs
Fetch all jobs created by the authenticated recruiter.



### GET /api/recruiter/jobs/:jobId/questions
Generate mock interview questions for a specific recruiter job.

### POST /api/recruiter/jobs/:jobId/questions
Save recruiter-provided questions for a specific job.

```json body
{
  "questions": [
    {
      "id": "q1",
      "category": "SIEM & Log Analysis",
      "question": "How do you construct a SIEM search query in Splunk ....?",
      "context": "Evaluates hands-on log analysis skills using industry-st....",
      "hints": [
        "Focus on high volume of failed ......"
      ],
      "evaluationRubric": {
        "scoringScale": "1-5",
        "levels": {
          "1": "Shows minimal ...",
          "2": "Understands ....",
          "3": "Provides a working basic ...",
          "4": "Formulates an accurate, optimized query ...",
          "5": "Demonstrates advanced query crafting..."
        }
      }
    },
}
```

## Error format

The API returns JSON errors in the following shape:

```json
{
  "success": false,
  "error": "Description of the issue"
}
```

Common status codes:

- 400: invalid input or bad request
- 404: resource not found
- 500: server error

