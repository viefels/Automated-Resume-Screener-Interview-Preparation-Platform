import getScores from "../services/scoring_algo.services.js";
import { Resume, Job } from "../models/index.js";

export default async function getScoreController(req, res){
    try{
        const { uid } = req.user;

        const cand = await Resume.findOne({ where: { userId: uid } });
        if(!cand){
            return res.status(404).json({
                success: false,
                error: "Candidate not found"
            });
        }

        const JOBS = await Job.findAll();

        const matchedJobs = [];
        JOBS.forEach( jobModel => {
            const job = jobModel.toJSON();
            const {keywords, jobDescription} = job;
            
            const getJobScore = getScores({keywords, jobDescription}, cand);
            const {overallScore, skillsMatched,  missingSkills} = getJobScore;

            if(getJobScore.overallScore > 50){
                const{recruiterId,keywords,createdAt,...safeJob} = job
                matchedJobs.push({overallScore, skillsMatched,  missingSkills, job: safeJob})
            }
        });

        if(matchedJobs.length < 1){
            return res.status(200).json({
                success:true,
                message: "No job matches found"
            })
        }

        return res.status(200).json({
            success: true,
            data: matchedJobs
        });

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            error: "Server failed to respond and could not get job matches"
        })
    }
}