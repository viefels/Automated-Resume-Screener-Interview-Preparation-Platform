import { User, Resume } from "../models/index.js";

export default async function handleFormRoute(req, res){
    try{
        const candidateData = req.body.validatedCandidate;
        const {uid} = req.user;

        await User.update({ hasResume: true }, { where: { id: uid } });
        
        const [resume, created] = await Resume.findOrCreate({
            where: { userId: uid },
            defaults: { ...candidateData }
        });

        if (!created) {
            await resume.update(candidateData);
        }
        
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