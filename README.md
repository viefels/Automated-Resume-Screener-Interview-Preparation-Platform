# Automated Resume Screener Interview Preparation Platform Backend API

This backend exposes authentication, resume submission, resume file parsing, recruiter job management, and mock interview question generation endpoints.

Base URL:
- Local development: http://localhost:3000/api

Authentication:
- Most endpoints require a Bearer token.
- Obtain a token by calling the login endpoint.
- Send the token in the Authorization header:
  - Authorization: Bearer <token>

## 1. Authentication

### POST /api/register
Create a new user account.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "candidate"
}
```

Required fields:
- email: valid email address
- password: minimum 8 characters
- role: either "candidate" or "recruiter"

Validation rules:
- email must be a valid email format
- password must be at least 8 characters long
- role must be one of the allowed values

Success response:
- Status: 201
- Body:
```json
{
  "success": true,
  "message": "Registration successful"
}
```

Error responses:
- 400: validation failure or duplicate email
- 500: server error

### POST /api/login
Authenticate an existing user and receive a JWT token.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "candidate"
}
```

Required fields:
- email
- password
- role

Success response:
- Status: 200
- Body:
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

Error responses:
- 400: invalid credentials or validation failure
- 500: server error

## 2. Candidate endpoints

All candidate routes require:
- Authorization: Bearer <token>
- A user whose role is "candidate"

### POST /api/candidate/resume
Save a fully structured candidate resume payload.

Request body:
```json
{
  "candidate": {
    "basics": {
      "fullName": "Jane Doe",
      "jobTitle": "Software Engineer",
      "email": "jane@example.com",
      "phone": [
        { "phone1": "+14155552671" }
      ],
      "nationality": ["American"],
      "dob": "12/04/1995",
      "maritalStatus": "Single",
      "location": {
        "city": "Seattle",
        "country": "USA"
      },
      "links": [
        {
          "label": "LinkedIn",
          "url": "https://www.linkedin.com/in/jane-doe"
        }
      ],
      "fullAddress": "123 Main Street, Seattle, USA",
      "summary": "Experienced backend developer",
      "totalYearsExperience": 5
    },
    "skills": {
      "technical": ["JavaScript", "Node.js", "Express"],
      "toolsAndFrameworks": ["Docker", "PostgreSQL"]
    },
    "workExperience": [
      {
        "jobTitle": "Backend Developer",
        "company": "Acme Corp",
        "location": "Remote",
        "startDate": "2021-01",
        "endDate": "Present",
        "highlights": ["Built APIs", "Improved performance"]
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "institution": "University of Washington",
        "startDate": "2015-09",
        "endDate": "2019-06",
        "honors": "Cum Laude",
        "gpa": "3.8"
      }
    ],
    "projects": [
      {
        "name": "Inventory API",
        "description": "Built a REST API for inventory management",
        "technologiesUsed": ["Node.js", "Express"],
        "link": "https://github.com/example/inventory-api"
      }
    ],
    "certifications": [
      {
        "title": "AWS Certified Developer",
        "issuer": "Amazon",
        "issueDate": "2023-01"
      }
    ],
    "languages": [
      {
        "language": "English",
        "fluency": "Fluent"
      }
    ],
    "feedback": {}
  }
}
```

Validation details:
- candidate is required
- basics.fullName is required and must be at least 5 characters
- basics.email must be a valid email address
- basics.phone entries must match an international phone format such as +14155552671
- basics.nationality must contain at least one value
- basics.dob must follow the format dd/mm/yyyy when provided
- basics.location.city and basics.location.country are required
- basics.links entries must contain a valid URL when provided
- basics.totalYearsExperience must be a positive number between 1 and 99
- skills.technical must contain at least one skill
- languages must contain at least one entry

Success response:
- Status: 201
- Body:
```json
{
  "success": true,
  "message": "Resume successfully saved"
}
```

Error responses:
- 400: invalid or incomplete payload
- 500: server error

### POST /api/candidate/resume/file
Upload a resume file and receive AI-extracted candidate data.

Request:
- Content-Type: multipart/form-data
- Field name: file
- Supported file types: .pdf, .docx
- Maximum file size: 5 MB

Example with curl:
```bash
curl -X POST http://localhost:3000/api/candidate/resume/file \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/resume.pdf"
```

Success response:
- Status: 200
- Body:
```json
{
  "success": true,
  "message": "File Uploaded Successfully:",
  "filename": "1710000000000-resume.pdf",
  "size": "1.20 MB",
  "autofillData": {}
}
```

Error responses:
- 400: no file provided, unsupported file type, or file too large
- 500: server processing error

### GET /api/candidate/resume/feedback
This route is currently registered but does not have an implementation handler, so it should be treated as a placeholder for future functionality.

## 3. Recruiter endpoints

All recruiter routes require:
- Authorization: Bearer <token>
- A user whose role is "recruiter"

### POST /api/recruiter/jobs
Create a recruiter job posting.

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

Required fields:
- jobTitle: required
- jobDescription: required

Optional fields:
- companyName
- primarySkills
- salaryRange
- location

Success response:
- Status: 201
- Body:
```json
{
  "success": true,
  "message": "Recruiter job created successfully"
}
```

Error responses:
- 400: missing required fields
- 500: server error

### GET /api/recruiter/jobs
Fetch all jobs created by the authenticated recruiter.

Success response:
- Status: 200
- Body:
```json
{
  "success": true,
  "message": "Query successful",
  "jobs": [{
  "jobTitle": "Software Engineer",
  "companyName": "Example Inc",
  "primarySkills": ["Node.js", "Express", "PostgreSQL"],
  "jobDescription": "Build and maintain backend services for a SaaS platform.",
  "salaryRange": {
      "min": 115000,
      "max": 155000
    },
  "location": "Remote"
}]
}
```

### GET /api/recruiter/jobs/:jobId/questions
Generate mock interview questions for a specific recruiter job.

Path parameters:
- jobId: ID of the job created by the authenticated recruiter

Success response:
- Status: 200
- Body:
```json
{
  "success": true,
  "questions": [{
          "id": "q1",
          "category": "React",
          "question": "",
          "context": "",
          "hints": [string values],
          "evaluationRubric": {
            "scoringScale": "1-5",
            "levels": { "1": "", "2": "", "3": "", "4": "", "5": "" }
          }
        }]
}
```

Error responses:
- 404: job not found
- 400: missing jobDescription or primarySkills for the job
- 500: server error

## 4. Common error patterns

The API returns JSON error responses in the following format:
```json
{
  "success": false,
  "error": "Description of the issue"
}
```

Validation failures may include a detailed errors object such as:
```json
{
  "success": false,
  "message": "Validation failed for candidate payload",
  "errors": {
    "candidate.basics.email": ["Invalid email format"]
  }
}
```

## 5. Notes

- The app is mounted under /api.
- The server uses JSON bodies for most endpoints, except the resume file upload endpoint.
- The resume file upload endpoint uses AI-based parsing and returns autofill data in the response.
- Recruiter job creation also uses AI to generate keywords for matching candidates.

 
