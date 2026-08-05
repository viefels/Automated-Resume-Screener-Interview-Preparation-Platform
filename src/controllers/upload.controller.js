import path from "node:path";
import fs from "node:fs/promises";
import handlePromptRes from '../prompts/handle_prompt_res.prompts.js';
import  extractText from '../utils/parsers.js';
import { candidateStructure } from "../prompts/candidate_structure.prompts.js";
import { success } from "zod";

const CAND_CV_PATH = path.join(import.meta.dirname, "../data/candidates_resume.json");
const CAND_CV = JSON.parse(await fs.readFile(CAND_CV_PATH, "utf8"));

const systemPrompt = `
    You are a CV parser. Extract information from the raw resume text into JSON format.
    Follow this exact JSON structure:
    ${JSON.stringify(candidateStructure)}.
    Note: 
    - keywords property values must be provided in output json.
    - keywords is a array that provides keywords that can be match with jobs skills and description using fuse.js
    - Use exact texts.
    - If a field is missing, set it to null or an empty array. Do not invent details!.
    `;



// const candidateFilePath = path.join(import.meta.dirname,"../data", "candidates.json");



export default async function uploadRouteCall(req, res) {
    try{
        if (!req.file) {
            return res.status(400).json({ 
                success:false,
                error: "No file provided." 
            });
        }

        const extractedTextVal = await extractText(req.file.path);
        const prompt = [{ "text": systemPrompt },
            { "text": `Source Text:\n${extractedTextVal}`}
        ]
        
        const {uid} = req.user;

        const candidate = await handlePromptRes(prompt)
        
        const candidateObj = {
            id: uid, 
            updatedAt: new Date(),
            ...candidate.candidate
        };
        

        

        //get index from db
        let getCVIndex = CAND_CV.findIndex(cand => cand.id === uid);

        getCVIndex = getCVIndex !== -1 ? getCVIndex : CAND_CV.length;
        
        CAND_CV[getCVIndex] = candidateObj;
        
        await fs.writeFile(CAND_CV_PATH, JSON.stringify(CAND_CV, null, 2));
        
        const {feedback, keywords, ...safecand} = candidateObj;
        
        return res.status(200).json({
            success: true,
            message: "File Uploaded Successfully: ",
            filename: req.file.filename,
            size: `${(req.file.size/ (1024 * 1024)).toFixed(2)} MB`,
            autofillData: safecand 

        });
    }
    catch(err){
        console.log(err.message)
        throw err;
    }
    
}
