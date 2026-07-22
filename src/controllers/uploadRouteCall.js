import path from "node:path";
import handlePromptRes from '../prompts/handlePromptRes.js';
import  extractText from '../utils/parsers.js';
import { candidateStructure } from '../prompts/parseJSONStructure.js';

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
            return res.status(400).json({ error: "No file provided." });
        }

        const extractedTextVal = await extractText(req.file.path);
        const prompt = [{ "text": systemPrompt },
            { "text": `Source Text:\n${extractedTextVal}`}]
        
        const candidateObj = await handlePromptRes(prompt); 
        return res.status(200).json({
            message: "File Uploaded Successfully: ",
            filename: req.file.filename,
            size: `${(req.file.size/ (1024 * 1024)).toFixed(2)} MB`,
            autofillData: candidateObj 

        });
    }
    catch(err){

        throw err;
    }
    
}