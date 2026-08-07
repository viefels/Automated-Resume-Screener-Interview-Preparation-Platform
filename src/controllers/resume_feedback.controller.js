import { Resume } from "../models/index.js";

export default async function getResumeFeedback(req, res){
    try{
        const userId = req.user.uid;
        const candidate = await Resume.findOne({ where: { userId } });

        if(!candidate){
            return res.status(404).json({
                success:false,
                error: "Candidate resume not uploaded yet"
            });
        }
        return res.status(200).json({
            success: true,
            data: candidate.feedback
        });
    }
    catch(err){
        return res.status(500).json({ 
            success: false, 
            error: "Server failed to get resume feedback" 
        });
    }
}