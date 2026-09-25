import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { configDotenv } from "dotenv";
import {sequelize, User, Resume, PendingRegistrations } from "../models/index.js";
import generateSecureOtp, {hashOtp} from "../utils/generate_token.js";
import sendMail from "../services/email.service.js";
configDotenv({ path: "../../.env" });

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export async function register(req, res){
    try{
        const {email, password, role, fullname} = req.body;
            
        const existingUser = await User.findOne({ where: { email } });

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const existingPending = await PendingRegistrations.findOne({ where: { email } });
        const hashedPsw = await bcrypt.hash(password, 10);
        const {otp, hashedOtp, expiresAt} = generateSecureOtp(6);

        if(existingPending){
            const otpExpiry = existingPending.otpExpiresAt;
            const currentDate = new Date();
            const currentAttempts = existingPending.attempts;
            const diffInMs = otpExpiry.getTime() - currentDate.getTime();
            const diffInMinutes = diffInMs / (1000 * 60);

            if( currentAttempts >= 10){
                if(diffInMinutes > 0){
                    return res.status(429).json({ 
                        success:false,
                        message: `Too many attempts. Try again after ${Math.ceil(diffInMinutes.toFixed(1))} minutes`
                    });
                } else{
                    await existingPending.update({ attempts  : 0});
                }
            }

            await existingPending.update({
                fullname,
                passwordHash: hashedPsw,
                role: role,
                hasResume: false,
                otpHash: hashedOtp,
                otpExpiresAt: expiresAt,
                attempts: existingPending.attempts + 1
            })
        } else{
            await PendingRegistrations.create({
                email,
                fullname,
                passwordHash: hashedPsw,
                role: role,
                hasResume: false,
                otpHash: hashedOtp,
                otpExpiresAt: expiresAt,
                attempts:0
            })
        }

        await sendMail(email, otp);

        return res.status(200).json({
            success:true,
            message: 'Verification code sent to your email.'
        })

        
    }catch(err){
        console.error("Registration error: ", err);
        return res.status(500).json({
            success: false,
            message: 'Registration failed.'
        }); 
    }
}

export async function verifyOtp(req, res){
    const t = await sequelize.transaction()
    try{
        const {email, otp} = req.body;
        const pendingReg = await PendingRegistrations.findOne({ where: { email } });

        if(!pendingReg){
            await t.rollback();
            return res.status(400).json({ 
                success:false,
                error: "No registration session found. Sign up again." 
            });
        }
        const {otpHash, otpExpiresAt, attempts, ...userData} = pendingReg.get({ plain: true });
        const currentDate = new Date();
        const diffInMs = otpExpiresAt.getTime() - currentDate.getTime();
        const diffInMinutes = diffInMs / (1000 * 60);

        if(attempts > 10){
            await t.rollback();
            return res.status(429).json({ 
                success:false,
                error: "Too many failed attempts. Please restart signup." 
             });
        }
        if(diffInMinutes <= 0){
            await t.rollback();
            return res.status(400).json({ 
                success:false,
                error: "Code has expired. Request a new one." 
            });
        }

        const inputOtpHash = hashOtp(otp);
        const isMatch = crypto.timingSafeEqual(
            Buffer.from(inputOtpHash.hashedOtp),
            Buffer.from(otpHash)
        );
        if(!isMatch){
            await t.rollback();
            await pendingReg.increment("attempts", { by: 1});
            return res.status(400).json({ 
                success:false,
                error: "Invalid verification code." 
            });
        }

        const user = await User.create({email, ...userData }, { transaction: t });

        await pendingReg.destroy({ transaction: t });

        await t.commit();

        res.status(201).json({
            success: true,
            message: "Account verified and created successfully."
        });
    }
    catch(err){
        await t.rollback();
        console.error("Verification error: ", err);
        return res.status(500).json({
            success: false,
            message: "Email verification failed."
        }); 
    }
}

export async function login(req, res){
    try{
        const { email, password } = req.body;
        
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
