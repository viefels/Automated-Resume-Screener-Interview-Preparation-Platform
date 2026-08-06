import fs from "fs/promises";
import path from "node:path";


const RECRUITER_JOBS_PATH = path.join(import.meta.dirname, "../data/jobs.json");
const recruiterJobs = JSON.parse(await fs.readFile(RECRUITER_JOBS_PATH, "utf8"));

export default function getResumeFeedback(req, res){
    try{
        const userId = req.user.uid;
        const candidate = CAND_CV.find(c => c.id === userId);

        if(!candidate){
            return res.status(404).json({
                success:false,
                error: "Candidate resume not uploaded yet"
            })
        }
        return res.status(200).json({
            success: true,
            data: candidate.feedback
        })
    }
    catch(err){
        return res.status(500).json({ 
            success: false, 
            error: "Server failed to get resume feedback" 
        });
    }
}