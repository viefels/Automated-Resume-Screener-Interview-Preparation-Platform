import express from "express";
import multer from "multer";
import upload,{ ValidationError } from "../middleware/multer.middleware.js";
import uploadRouteCall from "../controllers/upload.controller.js";
import handleForm from "../controllers/handle_resume_form.controller.js";
import validateResumeData from "../middleware/validate-form.middleware.js";
import * as user from "../middleware/auth.middleware.js";
import * as userController from "../controllers/auth.controller.js";
import { createRecruiterJob, generateMockInterviewQuestions, getRecruiterJob } from "../controllers/recruiter.controller.js";



const router = express.Router();

router.post("/resumes", user.verifyToken, validateResumeData, handleForm);


router.post("/register", user.validateUserDetails, userController.register);

router.post("/login", user.validateUserDetails, userController.login);

router.post("/recruiter/jobs", user.verifyToken, user.verifyRecruiter, createRecruiterJob);
router.get("/recruiter/jobs", user.verifyToken, user.verifyRecruiter, getRecruiterJob);
router.get("/recruiter/jobs/:jobId/questions", user.verifyToken, user.verifyRecruiter, generateMockInterviewQuestions);
// router.get("/recruiter/jobs/:jobId/match-candidates", user.verifyToken, matchCandidatesToJob);

router.post("/resumes/me/file", upload.single('file'), uploadRouteCall);



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