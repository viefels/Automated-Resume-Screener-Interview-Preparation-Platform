import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'node:crypto';
import { configDotenv } from "dotenv";
import { User, Resume } from "../models/index.js";
configDotenv({ path: "../../.env" });

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export async function register(req, res){
    try{
        const {email, password, role} = req.body;
            
        const existing = await User.findOne({ where: { email } });
        if(existing){
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPsw = await bcrypt.hash(password, 10);

        const user = await User.create({
            id: `user-${crypto.randomUUID()}`,
            email: email,
            passwordHash: hashedPsw,
            role: role,
            hasResume: false
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Server failed to respond register new user request'
        }); 
    }
}

export async function login(req, res){
    try{
        const {email, password} = req.body;
        
        const cand = await User.findOne({ where: { email } });
        
        if(!cand){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const role = cand.role
        const isPsw = await bcrypt.compare(password, cand.passwordHash);
        if(!isPsw){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const {id, hasResume} = cand;
        
       const cvDetails = {};

        if(hasResume){
            const candCV = await Resume.findOne({ where: { userId: id } });
            const { keywords , createdAt, userId, ...safecand } = candCV.toJSON();

            cvDetails["targetRole"] = safecand.feedback?.targetRole;
            cvDetails["overallMatch"] = safecand.feedback?.overallMatch;
        }

        

        const tokenPayLoad = {
            uid: id,
            role: role
        }

        const token = jwt.sign(tokenPayLoad, JWT_SECRET_KEY, { expiresIn: "24hr" });

        return res.status(200).json({
            success: true,
            token: token,
            message: "Logged In successfully",
            profile: { email, role, hasResume },
            cvDetails
        })
    } 
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Server failed to respond to login request'
        });
    }
}

export async function forgetPassword(req, res){
    try{
        const {email} = req.body;
        
        const cand = await User.findOne({ where: { email } });
        
        if(!cand){
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        // nodemailer

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        })
    } 
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Server failed to respond to forget password request'
        });
    }
}
