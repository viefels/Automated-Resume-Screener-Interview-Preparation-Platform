import fs from "fs/promises";
import path from "node:path";


const CAND_CV_PATH = path.join(import.meta.dirname, "../data/candidates_resume.json");
const USERS_PATH =  path.join(import.meta.dirname, "../data/candidates_basics.json");


const CAND_CV = JSON.parse(await fs.readFile(CAND_CV_PATH, "utf8"));
const USERS = JSON.parse(await fs.readFile(USERS_PATH, "utf8"));

export default async function handleFormRoute(req, res){
    try{
        const candidateData = req.body.validatedCandidate;
        const {uid, role} = req.user;

        const thisUser = USERS.find(user => user.id === uid)
        thisUser.hasResume = true
        

        candidateData.id = uid;
        candidateData.updatedAt= new Date();

        let getCVIndex = CAND_CV.findIndex(cand => cand.id === uid);

        getCVIndex = getCVIndex !== -1 ? getCVIndex : CAND_CV.length;

        CAND_CV[getCVIndex] = candidateData;

        await fs.writeFile(CAND_CV_PATH, JSON.stringify(CAND_CV, null, 2));
        await fs.writeFile(USERS_PATH, JSON.stringify(USERS, null, 2));
        
        return res.status(201).json({
            success: true,
            message: "Resume successfully saved"
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Server error while saving candidate'
        });
    }
}