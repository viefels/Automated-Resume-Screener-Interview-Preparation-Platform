import path from "node:path";
import handlePromptRes from '../prompts/handle_prompt_res.prompts.js';
import extractText from '../utils/parsers.js';
import { candidateStructure } from "../prompts/candidate_structure.prompts.js";
import { User, Resume } from "../models/index.js";

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
        ];
        
        const {uid} = req.user;

        await User.update({ hasResume: true }, { where: { id: uid } });

        const candidate = await handlePromptRes(prompt);
        console.log()
        
        const candidateObj = {
            ...candidate.candidate
        };
        
        const [resume, created] = await Resume.findOrCreate({
            where: { userId: uid },
            defaults: candidateObj
        });

        if (!created) {
            await resume.update(candidateObj);
        }
        
        const {feedback, keywords, id, createdAt, userId, ...safecand} = resume.toJSON();
        
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
