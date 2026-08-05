import fs from "node:fs/promises";
import path from "node:path";

const QUESTIONS_PATH = path.join(import.meta.dirname, "../data/questions.json");
const questions = JSON.parse(await fs.readFile(QUESTIONS_PATH, "utf8"));

export default function getCandQuestions(req, res){
    try{
        const { uid } = req.user;
        const { jobId } = req.params;

        const existing = questions.find(job => job.jobId === jobId);

        if(!existing){
        return res.status(200).json({
            success: true,
            error: "Job not found",
        })
        }
        
        return res.status(200).json({
        success: true,
        questions: existing?.questions || []
        });
    }
    catch(err){
        return res.status(500).json({ 
            success: false, 
            error: "Server could not respond to fetch interview questions request" 
        });
    }
}