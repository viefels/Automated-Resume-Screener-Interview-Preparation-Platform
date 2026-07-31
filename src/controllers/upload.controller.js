import path from "node:path";
import fs from "node:fs/promises";
import handlePromptRes from '../prompts/handle_prompt_res.prompts.js';
import  extractText from '../utils/parsers.js';
import { candidateStructure } from "../prompts/candidate_structure.prompts.js";
import { success } from "zod";

const systemPrompt = `
    You are a CV parser. Extract information from the raw resume text into JSON format.
    Follow this exact JSON structure:
    ${JSON.stringify(candidateStructure)}
    Use exact texts.
    If a field is missing, set it to null or an empty array. Do not invent details!.
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
            { "text": `Source Text:\n${extractedTextVal}`}]
        
        const candidateObj = await handlePromptRes(prompt); 
        // await fs.writeFile(path.join(import.meta.dirname, "../data/candidates.json"), JSON.stringify(candidateObj, null, 2));
        return res.status(200).json({
            success: true,
            message: "File Uploaded Successfully: ",
            filename: req.file.filename,
            size: `${(req.file.size/ (1024 * 1024)).toFixed(2)} MB`,
            autofillData: candidateObj 

        });
    }
    catch(err){
        console.log(err.message)
        throw err;
    }
    
}