import express from "express";
import multer from "multer";
import upload,{ ValidationError } from "../middleware/multerMiddleware.js";
import uploadRouteCall from "../controllers/uploadRouteCall.js";
import handleForm from "../controllers/handleCandidateForm.js";
import validateResumeData from "../middleware/validateResumeForm.js";


const router = express.Router();

router.post("/resume", validateResumeData, handleForm);

router.post("/resume/upload", upload.single('file'), uploadRouteCall);



router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
        }

    return res.status(400).json({ error: 'File upload failed.' });
    } else if (err instanceof ValidationError || err.name === "ValidationError") {

        return res.status(400).json({ error: err.message });
        
    } else if(err){
        return res.status(500).json({
            success:false,
            nessage: "Server faild to respond"
        })
    }
    next();
});


export default router;