import nodemailer from "nodemailer";
import dns from "node:dns";
import { configDotenv } from "dotenv";
import emailTemplate from "./email_template.js";

configDotenv();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  port:587,
  auth:{
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter setup error:", error);
  } else {
    console.log("Mail server is ready to send messages");
  }
}); 

dns.setDefaultResultOrder("ipv4first");
const verificationUrl = `https://automated-resume-screener-interview.onrender.com`;

export default async function sendMail(toEmail, otp){
  const mailOptions = {
    from: '"VettKazi Team" <' + process.env.NODEMAILER_EMAIL + '>',
    to: toEmail,
    subject: "Verify your email",
    text: `Welcome to vettKazi!\n\nPlease verify your account by visiting this link: ${verificationUrl}\n\nThis link expires in 24 hours.`,
    html: emailTemplate(otp),
  }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            reject(err); 
        } else {
            console.log("Email sent: " + info.response);
            resolve(info); 
        }
        });
    });
}