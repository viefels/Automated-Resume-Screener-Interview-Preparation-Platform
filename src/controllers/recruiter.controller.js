import { buildMockInterviewPrompt } from "../prompts/mock_interview.prompts.js";
import { promptAI } from "../prompts/handle_prompt_res.prompts.js";
import { Job, JobQuestion } from "../models/index.js";


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

    const jobCount = await Job.count();

    const newJob = {
      id: String(jobCount + 1).padStart(3, "0"),
      recruiterId,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName || null,
      jobDescription: payload.jobDescription,
      salaryRange: payload.salaryRange || null,
      location: payload.location || null,
    };
    

    const prompt = [
      {text: `Return keywords that will be used by fuse.js to score against candidates Resume, keywords includes skills and everything important in Job Descriptions Do not include markdown or any text outside the JSON object, Return valid JSON only with this exact structure:
        {keywords:[]}`},
      {text: `
        Job Description: ${newJob.jobDescription}`}
    ]

    const aiResponse = await promptAI(prompt);
    newJob.keywords = aiResponse.keywords;
    
    await Job.create(newJob);

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

export async function getRecruiterJob(req, res) {
  try{
    const recruiterId = req.user.uid;
    const recruiterJobs = await Job.findAll({ where: { recruiterId } });

    if(recruiterJobs.length < 1){
      return res.status(200).json({
        success: true,
        message: "No jobs available",
        jobs: []
      })
    }

    const thisJobs = recruiterJobs.map(job => {
      const {recruiterId, id, keywords, ...safeJob} = job.toJSON();
      return safeJob;
    });
    
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
    const { jobId } = req.params;
    const recruiterId = req.user.uid;

    const existing = await Job.findOne({ where: { recruiterId, id: jobId } });

    if(!existing){
      return res.status(200).json({
        success: false,
        error: "Job not found",
      })
    }

    const job = existing.toJSON();
    const primarySkills = job.keywords || []; 
    const jobDescription = job.jobDescription;

    if (!jobDescription) {
      return res.status(400).json({ 
        success: false, 
        error: "Job description is missing" 
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

export async function postRecruiterQuestion(req, res){
  try{
    const { jobId } = req.params;
    const validateQuestions = req.body;

    const [questionSet, created] = await JobQuestion.findOrCreate({
      where: { jobId },
      defaults: { questions: validateQuestions }
    });

    if (!created) {
      await questionSet.update({ questions: validateQuestions });
    }
    
    return res.status(201).json({
      success: true,
      message: "Questions successfully saved"
    });

  }
  catch(err){
    return res.status(500).json({
      success: false,
      error: 'Server error while saving questions'
    });
  }
}
