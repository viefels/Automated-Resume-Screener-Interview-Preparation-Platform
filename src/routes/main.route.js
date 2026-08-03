import express from "express";
import multer from "multer";
import upload,{ ValidationError } from "../middleware/multer.middleware.js";
import uploadRouteCall from "../controllers/upload.controller.js";
import handleForm from "../controllers/handle_resume_form.controller.js";
import validateResumeData from "../middleware/validate-form.middleware.js";
import * as user from "../middleware/auth.middleware.js";
import * as userController from "../controllers/auth.controller.js";
import { createRecruiterJob, generateMockInterviewQuestions, getRecruiterJob } from "../controllers/recruiter.controller.js";

import updateDB from "../lib/db_handler.js";


// const router = express.Router();
// router.get("/", (req,res)=>{
//     updateDB("kskama")
//     return res.status(200).send("404 not found")
// });


//auth
router.post("/register", user.validateUserDetails, userController.register);
router.post("/login", user.validateUserDetails, userController.login);

//candidate
router.post("/candidate/resume", user.isAuthenticated,user.isCandidate, validateResumeData, handleForm);
router.post("/candidate/resume/file", user.isAuthenticated, user.isCandidate, upload.single('file'), uploadRouteCall);
router.get("/candidate/resume/feedback", user.isAuthenticated, user.isCandidate);

//recruiter
router.post("/recruiter/jobs", user.isAuthenticated, user.isRecruiter, createRecruiterJob);
router.get("/recruiter/jobs", user.isAuthenticated, user.isRecruiter, getRecruiterJob);
router.get("/recruiter/jobs/:jobId/questions", user.isAuthenticated, user.isRecruiter, generateMockInterviewQuestions);
// router.get("/recruiter/jobs/:jobId/match-candidates", user.isAuthenticated, matchCandidatesToJob);





router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success:false,
                error: 'File size exceeds the 5MB limit.' 
            });
        }

    return res.status(400).json({ error: 'File upload failed.' });
    } else if (err instanceof ValidationError || err.name === "ValidationError") {

        return res.status(400).json({ 
            success:false, 
            error: err.message 
        });
        
    } else if(err){
        return res.status(500).json({
            success:false,
            nessage: "Server faild to respond"
        })
    }
    next();
});


export default router;