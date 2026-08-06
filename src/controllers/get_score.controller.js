import getScores from "../services/scoring_algo.services.js";
import path from "node:path";
import fs from "fs/promises";
import { success } from "zod";

const CAND_CV_PATH = path.join(import.meta.dirname, "../data/candidates_resume.json");
const RECRUITER_JOBS_PATH = path.join(import.meta.dirname, "../data/jobs.json");


const CAND_CV = JSON.parse(await fs.readFile(CAND_CV_PATH, "utf8"));
const JOBS = JSON.parse(await fs.readFile(RECRUITER_JOBS_PATH, "utf8"));

export default function getScoreController(req, res){
    try{
        const { uid } = req.user;

        const cand = CAND_CV.find(c=>c.id === uid);
        if(!cand){
            return res.status(404).json({
                success: false,
                error: "Candidate not found"
            })
        }

        const matchedJobs = []
        JOBS.forEach( job => {
            const {keywords, jobDescription} = job;
            const candKeywords = cand.keywords
            
            const getJobScore = getScores({keywords, jobDescription}, cand);
            const {overallScore, skillsMatched,  missingSkills} = getJobScore;

            const {totalYearsExperience, workExperience, education, projects,feedback} = cand;

            
            if(getJobScore.overallScore > 50){
                const{recruiterId,keywords,createdAt,...safeJob} = job
                matchedJobs.push({overallScore, skillsMatched,  missingSkills, job: safeJob})
            }
        })

        if(matchedJobs.length < 1){
            return res.status(200).json({
                success:true,
                message: "No job matches found"
            })
        }

        return res.status(200).json({
            success: true,
            data: matchedJobs
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            error: "Server failed to respond and could not get job matches"
        })
    }
}