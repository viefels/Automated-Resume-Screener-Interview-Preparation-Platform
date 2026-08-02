export function buildMockInterviewPrompt(jobDesc, skills) {
  const context = `
    Company: ${skills.join(",")}
    Job Description: ${jobDesc}`;

  return [{ text: `You are an expert technical recruiter and interviewer. Create realistic mock interview questionnaire based on the provided job description. Return valid JSON only with this exact structure:
      { "questions": 
       [{
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
