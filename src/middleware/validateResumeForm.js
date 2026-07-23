import {z} from "zod";
import express from "express"

//middleware
//returns bool
export default function validateResumeData(req, res, next){
    
    const candidateData = req.body;

    if(!req.body){
        return res.status(400).json({
            success: false,
            message: 'Payload is empty. Please provide candidate data.'
        })
    }

    const stringTrim = z.string("Please provide a valid value").trim();

    const candidateSchema = z.object({
    "candidate": z.object({
        "basics":  z.object({
            "fullName": stringTrim.min(5, "Name is required"),
            "jobTitle": stringTrim.min(1, "Must be at least 5 characters long").nullish(),
            "email": stringTrim.email("Invalid email format"),

            "phone":z.array(
                z.object({"phone1": stringTrim.regex(/^\+[0-9]\d{7,14}$/)},"Please provide a valid value").nullish(),
                z.object({"phone2": stringTrim.regex(/^\+[0-9]\d{7,14}$/)},"Please provide a valid value").nullish()
                
            ).nullish(),

            "nationality": z.array(stringTrim,"Must provide a valid Nationality").nonempty("Must provide at least one Nationality"),
            "dob": stringTrim.regex(/^\d{2}\/\d{2}\/\d{4}$/).nullish(),
            "maritalStatus": stringTrim.nullish(),
            "location": z.object({
                "city": stringTrim,
                "country": stringTrim
            },"Please provide a valid value"),
            "links": z.array(z.object(
                {
                "label": stringTrim.nullish(),
                "url": stringTrim.url("Please enter a valid URL")
                },"Please provide a valid value"
            )).nullish(),

            "fullAddress": z.string("Please enter a valid Address"),
            "summary": stringTrim.min(5, "Please enter at least 5 words").nullish(),
            "totalYearsExperience": z.number("Please enter a valid number").positive("Must be positive number").min(1, "Please enter a valid number").max(99, "Please enter a valid number")
        }),
        "skills": z.object({
            "technical": z.array(stringTrim).nonempty(),
            "toolsAndFrameworks": z.array(stringTrim).nullish(),
        },"Please provide a valid value"),
        "workExperience": z.array(z.object(
        {
            "jobTitle": stringTrim,
            "company": stringTrim,
            "location": stringTrim.nullish(),
            "startDate": stringTrim.nullish(),
            "endDate": stringTrim.nullish(),
            "highlights": z.array(stringTrim).nullish()
        },"Please provide a valid value")),
        "education": z.array(z.object(
        {
            "degree": stringTrim,
            "fieldOfStudy": stringTrim,
            "institution": stringTrim,
            "startDate": stringTrim.nullish(),
            "endDate": stringTrim.nullish(),
            "honors": stringTrim.nullish(),
            "gpa": stringTrim.nullish()
        },"Please provide a valid value")).nonempty(),
        "projects": z.array(z.object(
        {
            "name": stringTrim,
            "description": stringTrim,
            "technologiesUsed": z.array(stringTrim).nullish(),
            "link": stringTrim.nullish()
        },"Please provide a valid value")).nullish(),
        "certifications": z.array(z.object({
            "title": stringTrim,
            "issuer": stringTrim.nullish(),
            "issueDate": stringTrim.nullish()
        },"Please provide a valid value")).nullish()
        ,
        "languages": z.array(z.object(
        {
            "language": stringTrim,
            "fluency": stringTrim.nullish()
        }
        ),"Please provide a valid value").nonempty("Please provide at least one language spoken")
    })
    })
    const result = candidateSchema.safeParse(candidateData);
    // console.log(typeof candidateData)
    if(!result.success){
        return res.status(400).json({
            success: false,
            message: 'Validation failed for candidate payload',
            errors: result.error.flatten()
      });
    }
    
    req.body.validatedCandidate = result.data.candidate;
    next();
}
