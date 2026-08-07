import express from "express";
import path from "node:path";
import multer from "multer";
import upload,{ ValidationError } from "../middleware/multer.middleware.js";
import uploadRouteCall from "../controllers/upload.controller.js";
import handleForm from "../controllers/handle_resume_form.controller.js";
import validateResumeData from "../middleware/validate-form.middleware.js";
import * as user from "../middleware/auth.middleware.js";
import * as userController from "../controllers/auth.controller.js";
import { createRecruiterJob, generateMockInterviewQuestions, getRecruiterJob, postRecruiterQuestion } from "../controllers/recruiter.controller.js";
import getResumeFeedback from "../controllers/resume_feedback.controller.js";
import validateQuestions from "../middleware/validate_questions.js";
import getScoreController from "../controllers/get_score.controller.js";
import getCandQuestions from "../controllers/get_candidate_questions.controller.js";



const router = express.Router();



//auth
router.post("/register", user.validateUserDetails(user.userSchemaRegister), userController.register);
router.post("/login", user.validateUserDetails(user.userSchemaLogin), userController.login);

//candidate
router.put("/candidate/resume", user.isAuthenticated,user.isCandidate, validateResumeData, handleForm);
router.post("/candidate/resume/file", user.isAuthenticated, user.isCandidate, upload.single('file'), uploadRouteCall);
router.get("/candidate/resume/feedback", user.isAuthenticated, user.isCandidate, getResumeFeedback);
router.get("/candidate/jobs/score", user.isAuthenticated, user.isCandidate, getScoreController);
router.get("/candidate/jobs/:jobId/questions", user.isAuthenticated, user.isCandidate, getCandQuestions);

//recruiter
router.post("/recruiter/jobs", user.isAuthenticated, user.isRecruiter, createRecruiterJob);
router.get("/recruiter/jobs", user.isAuthenticated, user.isRecruiter, getRecruiterJob);
router.get("/recruiter/jobs/:jobId/questions", user.isAuthenticated, user.isRecruiter, generateMockInterviewQuestions);
router.post("/recruiter/jobs/:jobId/questions",validateQuestions, user.isAuthenticated, user.isRecruiter, postRecruiterQuestion);


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

router.use((req, res) => {
  res.status(404).sendFile(path.join(import.meta.dirname, '../404.html')); 
});


export default router;
