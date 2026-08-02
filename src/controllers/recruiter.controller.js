import fs from "node:fs/promises";
import path from "node:path";
import { buildMockInterviewPrompt } from "../prompts/mock_interview.prompts.js";
import { promptAI } from "../prompts/handle_prompt_res.prompts.js";
import { success } from "zod";

const RECRUITER_JOBS_PATH = path.join(import.meta.dirname, "../data/jobs.json");
const CANDIDATE_DATA_PATH = path.join(import.meta.dirname, "../data/candidates_resume.json");

const recruiterJobs = JSON.parse(await fs.readFile(RECRUITER_JOBS_PATH, "utf8"));


function scoreCandidateAgainstJob(job, candidate) {
  const jobText = `${job.jobTitle || ""} ${job.jobDescription || ""} ${(job.requirements || []).join(" ")}`;
  const candidateText = [
    candidate?.basics?.summary,
    candidate?.skills?.technical?.join(" "),
    candidate?.skills?.toolsAndFrameworks?.join(" "),
    candidate?.workExperience?.map((item) => `${item.jobTitle} ${item.company} ${item.highlights?.join(" ")}`).join(" "),
    candidate?.education?.map((item) => `${item.degree} ${item.fieldOfStudy} ${item.institution}`).join(" "),
    candidate?.projects?.map((item) => `${item.name} ${item.description} ${(item.technologiesUsed || []).join(" ")}`).join(" "),
    candidate?.certifications?.map((item) => item.title).join(" ")
  ].filter(Boolean).join(" ");

  const jobKeywords = Array.from(new Set(extractKeywords(jobText)));
  const candidateTokens = normalizeText(candidateText).split(" ");
  const matchedKeywords = jobKeywords.filter((keyword) => candidateTokens.includes(keyword));

  let score = Math.round((matchedKeywords.length / Math.max(jobKeywords.length, 1)) * 100);

  const titleMatch = normalizeText(candidate?.workExperience?.[0]?.jobTitle || "").includes(normalizeText(job.jobTitle || ""));
  if (titleMatch) score += 10;

  const strongSkillMatch = (candidate?.skills?.technical || []).some((skill) => normalizeText(skill).includes(normalizeText(job.jobTitle || "")) || (job.requirements || []).some((requirement) => normalizeText(skill).includes(normalizeText(requirement))));
  if (strongSkillMatch) score += 8;

  return {
    id: candidate?.id,
    name: candidate?.basics?.fullName || "Candidate",
    email: candidate?.basics?.email || "",
    score: Math.min(100, score),
    matchedKeywords: matchedKeywords.slice(0, 8),
    summary: candidate?.basics?.summary || ""
  };
}

export async function createRecruiterJob(req, res) {
  try {
    const recruiterId = req.user.uid;
    const payload = req.body;

    

    if (!payload || !payload.jobTitle || !payload.jobDescription) {
      return res.status(400).json({
        success: false,
        error: "jobTitle and jobDescription are required"
      });
    }

    const newJob = {
      id: String(recruiterJobs.length).padStart(3, "0"),
      recruiterId,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName || null,
      primarySkills: payload.primarySkills || null,
      jobDescription: payload.jobDescription,
      salaryRange: payload.salaryRange || null,
      location: payload.location || null,
      createdAt: new Date().toISOString()
    };
    

    const prompt = [
      {text: `Return keywords that will be used by fuse.js to score against candidates Resume, keywords includes skills and everything important in Job Descriptions Do not include markdown or any text outside the JSON object, Return valid JSON only with this exact structure:
        {keywords:[]}`},
      {text: `
        Skills: ${newJob.primarySkills.join(", ")}
        Job Description: ${newJob.jobDescription}`}
    ]

    const aiResponse = await promptAI(prompt);
    newJob.keywords = aiResponse.keywords;
    
    recruiterJobs.push(newJob);
    await fs.writeFile(RECRUITER_JOBS_PATH, JSON.stringify(recruiterJobs, null, 2));

    return res.status(201).json({
      success: true,
      message: "Recruiter job created successfully"
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ 
      success: false, 
      error: "Failed to create recruiter job" });
  }
}

export function getRecruiterJob(req, res) {
  try{
    const recruiterId = req.user.uid;
    let thisJobs = [];
    if(recruiterJobs.length < 1){
      return res.status(200).json({
        success: true,
        message: "No jobs available",
        jobs: []
      })
    }
    for(const job of recruiterJobs){
      if(job.recruiterId === recruiterId){
        const {recruiterId, id, keywords,  ...safeJob} = job;
        thisJobs.push(safeJob);
      }
    }

    if(thisJobs.length < 1){
      return res.status(200).json({
        success: true,
        message: "No jobs found for this recruiter.",
        jobs: []
      })
    }
    
    return res.status(200).json({
      success: true,
      message: "Query successful",
      jobs: thisJobs
    })
  }
  catch(err){
    return res.status(500).json({
      success: false,
      error: "Server Error fetching recruiter jobs"
    })
  }
}

export async function generateMockInterviewQuestions(req, res) {
  try {
    const { jobId } =req.params;
    const recruiterId = req.user.uid;

    if(recruiterJobs.length < 1){
      return res.status(200).json({
        success: true,
        message: "No jobs available",
      })
    }

    const existing = recruiterJobs.find(job => job.recruiterId === recruiterId && job.id === jobId);

    if(!existing){
      return res.status(404).json({
        success: false,
        error: "Job not found",
      })
    }

    const {primarySkills, jobDescription} = existing;

    if (!jobDescription || !primarySkills) {
      return res.status(400).json({ 
        success: false, 
        error: "Please provide jobDescription and skills needed" 
      });
    }

    const prompt = buildMockInterviewPrompt(jobDescription, primarySkills);
    const aiResponse = await promptAI(prompt);

    return res.status(200).json({
      success: true,
      questions: aiResponse?.questions || []
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: "Failed to generate interview questions" 
    });
  }
}

// export async function matchCandidatesToJob(req, res) {
//   try {
//     if (req.user?.role !== "recruiter") {
//       return res.status(403).json({ success: false, error: "Only recruiters can rank candidates" });
//     }

//     const { jobId } = req.params;
//     const recruiterJobsData = await readRecruiterJobs();
//     const job = (recruiterJobsData.jobs || []).find((item) => item.id === jobId);

//     if (!job) {
//       return res.status(404).json({ success: false, error: "Job not found" });
//     }

//     const candidateData = JSON.parse(await fs.readFile(CANDIDATE_DATA_PATH, "utf8"));
//     const rankedCandidates = candidateData
//       .filter((candidate) => candidate?.basics?.fullName)
//       .map((candidate) => scoreCandidateAgainstJob(job, candidate))
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 10);

//     return res.status(200).json({
//       success: true,
//       jobTitle: job.jobTitle,
//       rankedCandidates
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, error: "Failed to rank candidates" });
//   }
// }
