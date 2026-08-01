# Recruiter Job Creation & AI Mock Interview Question API

## What I completed

I implemented a recruiter-focused backend feature set for the platform so recruiters can:

- create job postings from the API
- generate AI-based mock interview questions from a job description
- match and rank candidates against a created job

This work is now available through the backend routes and is ready for teammates to test and integrate into the frontend.

## What this feature does

### 1. Recruiter job creation
Recruiters can create a job posting by sending a request to the backend. The job includes:

- job title
- company name
- job description
- requirements
- location

### 2. AI mock interview question generation
Using the recruiter’s job description, the backend sends a prompt to Gemini and returns mock interview questions in JSON format.

### 3. Candidate matching and ranking
The backend compares candidate profiles against the uploaded job details and returns a ranked list of candidates based on how well they match the job.

## API endpoints

### Create a job
- Method: POST
- Route: /api/recruiter/jobs
- Auth: required

Request body:
```json
{
  "jobTitle": "Senior Frontend Engineer",
  "companyName": "Acme Tech",
  "jobDescription": "Build scalable React applications using TypeScript, React, and Node.js.",
  "requirements": ["React", "TypeScript", "Node.js"],
  "location": "Remote"
}
```

### Generate mock interview questions
- Method: POST
- Route: /api/recruiter/mock-interview/questions
- Auth: required

Request body:
```json
{
  "jobTitle": "Senior Frontend Engineer",
  "companyName": "Acme Tech",
  "jobDescription": "Build scalable React applications using TypeScript, React, and Node.js."
}
```

### Match and rank candidates
- Method: GET
- Route: /api/recruiter/jobs/:jobId/match-candidates
- Auth: required

## How you can use it

1. Start the server:
```bash
npm run dev
```

2. Log in as a recruiter to get a valid JWT token.

3. Use the endpoints above with the token in the Authorization header:
```http
Authorization: Bearer <token>
```

4. Create a job first, then use the mock interview and matching endpoints.

## Important notes

- The platform uses JWT authentication for recruiter access.
- The Gemini API key must be available in the environment file.
- The candidate matching feature is currently a first version and uses a simple scoring approach based on candidate profile data.

## Files involved

- src/controllers/recruiter.controller.js
- src/prompts/mock_interview.prompts.js
- src/routes/main.route.js
- src/prompts/handle_prompt_res.prompts.js

## Summary

This task adds the recruiter-side intelligence layer to the project. It allows recruiters to create jobs, generate tailored interview questions from those jobs, and get a ranked shortlist of relevant candidates.
