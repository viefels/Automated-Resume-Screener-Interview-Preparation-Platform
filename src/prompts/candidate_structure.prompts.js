 export const candidateStructure =
{
  "candidate": {
    "basics": {
      "fullName": "Candidate Name",
      "email": "candidate@example.com",
      "phone":[{"phone1": "+20110281900"}], //two phone object max
      "nationality": ["American", "Congolese"],
      "dob": "21/08/1980",
      "maritalStatus": "Single",
      "location": {
        "city": "City",
        "country": "Country"
      },
      "links": [
        {
          "label": "LinkedIn",
          "url": "https://linkedin.com/in/username"
        },
        {
          "label": "GitHub / Portfolio",
          "url": "https://github.com/username"
        }
      ],
      "fullAddress": "",
      "summary": "A concise overview highlighting core experience, main stack, and primary career accomplishments.",
      "totalYearsExperience": 4.5
    },
    "skills": {
      "technical": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
      ],
      "toolsAndFrameworks": [
        "Tool 1",
        "Tool 2"
      ]
    },
    "workExperience": [
      {
        "jobTitle": "Position Title",
        "company": "Company Name",
        "location": "City, Country or Remote",
        "startDate": "YYYY-MM",
        "endDate": "YYYY-MM or Present",
        "highlights": [
          "Key responsibility or achievement with measurable results.",
          "Engineered solutions that solved specific problems.",
          "Collaborated across teams to deliver features on schedule."
        ]
      }
    ],
    "education": [
      {
        "degree": "Degree Name",
        "fieldOfStudy": "Major / Discipline",
        "institution": "University / School Name",
        "startDate": "YYYY",
        "endDate": "YYYY",
        "honors": "Relevant honors or class standing (optional)",
         "gpa": "3.85/4"
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "description": "Brief summary of what the project does and its goal.",
        "technologiesUsed": [
          "Tech 1",
          "Tech 2"
        ],
        "link": "https://project-url.com"
      }
    ],
    "certifications": [
      {
        "title": "Certificate Name",
        "issuer": "Issuing Organization",
        "issueDate": "YYYY-MM"
      }
    ],
    "languages": [
      {
        "language": "Language Name",
        "fluency": "Proficiency level"
      }
    ],
    "feedback": {
      "targetRole": "Senior Product Designer",
      "overallMatch": {
        "score": "%",
        "remarks": "Good match for mid-to-senior design roles",
        "sectionScores": {
          "formatting": "%",
          "keywords": "%",
          "actionVerbs": "%"
        }
      },
      "keyHighlights": [
        "Excellent visual hierarchy & systems",
        "5+ years experience in Figma"
      ],
      "actionableFeedback": [
        "Quantify achievements with metrics",
        "Add cross-functional collab details",
        "Include design system governance"
      ]
    },
    "keywords": []
  }
}

