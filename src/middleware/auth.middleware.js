import express from "express"
import path from "node:path"; 
import jwt from "jsonwebtoken"
import z, { success } from "zod";
import { configDotenv } from "dotenv";
import { verify } from "node:crypto";
configDotenv({ path: "../../.env" });




const  userSchema = z.object({
    email: z.string("Email is required").trim().email("Please enter a valid email").toLowerCase(),
    password: z.string("Password is required").trim().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["candidate", "recruiter"], "Please provide a valid role").optional()
})

export function validateUserDetails(req, res, next){
    if(!req.body){
        return res.status(400).json({
            success: false,
            error: "Please provide a request"
        });
    }
    
    const result = userSchema.safeParse(req.body);
    
    if(!result.success){
        const getNestedErrors = (error) => {
            const formattedErrors = {};

            for (const issue of error.issues) {
                const path = issue.path.join('.'); 
                if (!formattedErrors[path]) {
                formattedErrors[path] = [];
                }
                formattedErrors[path].push(issue.message);
            }

            return formattedErrors;
        };

        return res.status(400).json({
            success: result.success,
            error: getNestedErrors(result.error)
        });
        
    }
    req.body = result.data;
    next()
}

export function isAuthenticated(req, res, next){
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            error: "Access denied. No token provided."
        });
    }
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = authHeader.split(" ")[1];

    try{
        const payload = jwt.verify(token, JWT_SECRET)

        req.user = payload;
        next()
    }
    catch(err){
        return res.status(401).json({
            success: false,
            error: "Access denied. Token provided is invalid or expired."
        });
    }

    

}

export function isRecruiter(req, res, next){
    const payLoad = req.user;

    if (req.user.role !== "recruiter") {
        return res.status(403).json({ 
        success: false, 
        error: "Only recruiter are authorized" 
        });
    }
    next();
}

export function isCandidate(req, res, next){
    const payLoad = req.user;

    if (req.user.role !== "candidate") {
        return res.status(403).json({ 
        success: false, 
        error: "Only candidates are authorized" 
        });
    }
    next();
}
