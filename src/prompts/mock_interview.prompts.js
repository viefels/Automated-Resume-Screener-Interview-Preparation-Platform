export function buildMockInterviewPrompt(jobDescription, jobTitle = "", companyName = "") {
  const context = [
    jobTitle ? `Job Title: ${jobTitle}` : null,
    companyName ? `Company: ${companyName}` : null,
    `Job Description:\n${jobDescription}`
  ]
    .filter(Boolean)
    .join("\n\n");

  return [
    {
      text: `You are an expert technical recruiter and interviewer. Create a realistic mock interview questionnaire based on the provided job description. Return valid JSON only with this exact structure:
      {
        "questions": [
          {
            "id": 1,
            "category": "Technical",
            "difficulty": "Medium",
            "question": "Question text",
            "followUpQuestions": ["Follow-up question 1", "Follow-up question 2"],
            "expectedAnswerFocus": "What a strong answer should cover"
          }
        ]
      }

      Requirements:
      - Use the job description as the primary source of truth.
      - Make the questions relevant to the role, required skills, and seniority level.
      - Include a good mix of technical, behavioral, and role-specific questions.
      - Keep the questions practical and suitable for a mock interview.
      - Return between 8 and 12 questions.
      - Do not include markdown or any text outside the JSON object.`
    },
    {
      text: context
    }
  ];
}
