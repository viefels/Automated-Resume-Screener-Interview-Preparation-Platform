import fs from "node:fs/promises";
import path from "node:path"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'node:crypto';
import { configDotenv } from "dotenv";
configDotenv({ path: "../../.env" });

const USERSPATH = path.join(import.meta.dirname, "../data/candidates_basics.json");
const CAND_CV_PATH = path.join(import.meta.dirname, "../data/candidates.json");
// const REC_CV_PATH = path.join(import.meta.dirname, "../data/recruiters.json");

const USERS = JSON.parse(await fs.readFile(USERSPATH, "utf8"));
const CAND_CV = JSON.parse(await fs.readFile(CAND_CV_PATH, "utf8"));
// const REC_CV = JSON.parse(await fs.readFile(REC_CV_PATH, "utf8"));

const JWT_SECRET_KEY = process.env.JWT_SECRET;



export async function register (req, res){
    try{
        const {email, password, role} = req.body;
            
        const existing = USERS.find((c) => c.email === email);
        if(existing){
            return res.status(400).json({
                success: false,
                error: "Email already exists"
            });
        }

        const hashedPsw = await bcrypt.hash(password, 10);

        const user = {
            id: `user-${crypto.randomUUID()}`,
            email: email,
            passwordHash: hashedPsw,
            role: role,
            ...(role === "candidate" ? {hasCv: false}: {}),
            createdAt: new Date()
        }
        
        USERS.push(user);
        await fs.writeFile(USERSPATH, JSON.stringify(USERS, null, 2));

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        })

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
        const {email, password, role} = req.body;
        
            const cand = USERS.find((c) => c.email === email && c.role === role);
            
            if(!cand){
                return res.status(400).json({
                    success: false,
                    error: "Invalid email or password"
                });
            }

            const isPsw = await bcrypt.compare(password, cand.passwordHash);
            if(!isPsw){
                return res.status(400).json({
                    success: false,
                    error: "Invalid email or password"
                });
            }
            const {id, hasCv} = cand;
            const candCV = CAND_CV.find(cv=>cv.id === id)

            const tokenPayLoad = {
                uid: id,
                role: role
            }

            const token = jwt.sign(tokenPayLoad, JWT_SECRET_KEY, { expiresIn: "1hr" });

            return res.status(200).json({
                success: true,
                token: token,
                message: "Logged In successfully",
                profile: { email, role, hasCv},
                cvDetails: candCV || null
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

