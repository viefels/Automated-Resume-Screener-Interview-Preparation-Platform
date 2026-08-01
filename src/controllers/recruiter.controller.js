import fs from "node:fs/promises";
import path from "node:path";
import { buildMockInterviewPrompt } from "../prompts/mock_interview.prompts.js";
import { promptAI } from "../prompts/handle_prompt_res.prompts.js";

const RECRUITER_JOBS_PATH = path.join(import.meta.dirname, "../data/recruiters.json");
const CANDIDATE_DATA_PATH = path.join(import.meta.dirname, "../data/candidates.json");

async function readRecruiterJobs() {
  const data = await fs.readFile(RECRUITER_JOBS_PATH, "utf8");
  return JSON.parse(data);
}

async function writeRecruiterJobs(data) {
  await fs.writeFile(RECRUITER_JOBS_PATH, JSON.stringify(data, null, 2));
}

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean)
    .filter((word) => word.length > 2 && !["with", "from", "that", "this", "have", "been", "will", "the", "and", "for", "your", "role", "team", "build", "using", "work"].includes(word));
}

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
    const recruiterId = req.user?.uid;
    const payload = req.body;

    if (!recruiterId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (req.user?.role !== "recruiter") {
      return res.status(403).json({ success: false, error: "Only recruiters can create jobs" });
    }

    if (!payload || !payload.jobTitle || !payload.jobDescription) {
      return res.status(400).json({
        success: false,
        error: "jobTitle and jobDescription are required"
      });
    }

    const recruiterJobsData = await readRecruiterJobs();
    const jobs = Array.isArray(recruiterJobsData.jobs) ? recruiterJobsData.jobs : [];

    const newJob = {
      id: `job-${Date.now()}`,
      recruiterId,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName || "",
      jobDescription: payload.jobDescription,
      requirements: payload.requirements || [],
      location: payload.location || "",
      createdAt: new Date().toISOString()
    };

    jobs.push(newJob);
    recruiterJobsData.jobs = jobs;
    recruiterJobsData.recruiterRequirements = recruiterJobsData.recruiterRequirements || newJob;

    await writeRecruiterJobs(recruiterJobsData);

    return res.status(201).json({
      success: true,
      message: "Recruiter job created successfully",
      job: newJob
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Failed to create recruiter job" });
  }
}

export async function generateMockInterviewQuestions(req, res) {
  try {
    if (req.user?.role !== "recruiter") {
      return res.status(403).json({ success: false, error: "Only recruiters can generate interview questions" });
    }

    const { jobDescription, jobTitle, companyName } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ success: false, error: "jobDescription is required" });
    }

    const prompt = buildMockInterviewPrompt(jobDescription, jobTitle, companyName);
    const aiResponse = await promptAI(prompt);

    return res.status(200).json({
      success: true,
      questions: aiResponse?.questions || []
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Failed to generate interview questions" });
  }
}

export async function matchCandidatesToJob(req, res) {
  try {
    if (req.user?.role !== "recruiter") {
      return res.status(403).json({ success: false, error: "Only recruiters can rank candidates" });
    }

    const { jobId } = req.params;
    const recruiterJobsData = await readRecruiterJobs();
    const job = (recruiterJobsData.jobs || []).find((item) => item.id === jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const candidateData = JSON.parse(await fs.readFile(CANDIDATE_DATA_PATH, "utf8"));
    const rankedCandidates = candidateData
      .filter((candidate) => candidate?.basics?.fullName)
      .map((candidate) => scoreCandidateAgainstJob(job, candidate))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      jobTitle: job.jobTitle,
      rankedCandidates
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Failed to rank candidates" });
  }
}
