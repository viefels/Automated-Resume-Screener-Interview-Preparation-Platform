import { JobQuestion } from "../models/index.js";

export default async function getCandQuestions(req, res){
    try{
        const { jobId } = req.params;

        const existing = await JobQuestion.findOne({ where: { jobId } });

        if(!existing){
            return res.status(200).json({
                success: true,
                error: "No questions assigned by recruiter",
            });
        }
        
        return res.status(200).json({
            success: true,
            questions: existing.questions || []
        });
    }
    catch(err){
        return res.status(500).json({ 
            success: false, 
            error: "Server could not respond to fetch interview questions request" 
        });
    }
}