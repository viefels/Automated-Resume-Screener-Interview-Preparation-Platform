import jwt from "jsonwebtoken"
import z from "zod";
import { configDotenv } from "dotenv";
configDotenv({ path: "../../.env" });




export const  userSchemaRegister = z.object({
    fullname: z.string("Name is required").trim().min(4, "Please provide fullname with at least 4 characters"),
    email: z.email("Please enter a valid email").trim().toLowerCase(),
    password: z.string("Password is required").trim().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["candidate", "recruiter"], "Please provide a valid role")
})

export const  otpVerifySchema = z.object({
    email: z.email("Please enter a valid email").trim().toLowerCase(),
    otp: z.string().trim().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must only contain numbers")
})

export const userSchemaLogin = userSchemaRegister.omit({ role: true, fullname: true });
export const userSchemaForgotPassword = userSchemaRegister.pick({ email: true, role: true, fullname: true });

export function validateUserDetails(schema){
    return(req, res, next) =>{
        if(!req.body){
            return res.status(400).json({
                success: false,
                message: "Please provide a request"
            });
        }
        
        const result = schema.safeParse(req.body);
        
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
                message: getNestedErrors(result.error)
            });
            
        }
        req.body = result.data;
        next()
    }
}

export function isAuthenticated(req, res, next){
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
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
            message: "Access denied. Token provided is invalid or expired."
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
