import Fuse from "fuse.js";




export default function getScores(job, candidate){
    const {keywords, jobDescription} = job
    const candKeywords = candidate.keywords
    if(keywords.length === 0 || candKeywords.length === 0){
        return {
            overallScore: 0,
            skillsMatched:{},
            missingSkills:{}
        }
    }

    const weightPerSkill = 100 / keywords.length;
    let overallScore = 0;

    const skillsMatched = {};
    const missingSkills = {};

    const fuse = new Fuse(keywords, { 
        threshold: 0.3
    });
    const matchedSet = new Set();

    candKeywords.forEach(c =>{
        const result = fuse.search(c);
        if(result.length > 0){
            matchedSet.add(result[0].item)
        }
    });

    keywords.forEach(j =>{
        const skillScore = Math.round(weightPerSkill * 10) / 10;
        if(matchedSet.has(j)){
            skillsMatched[j] = skillScore;
            overallScore += weightPerSkill
        } else{
            missingSkills[j] = skillScore
        }
    })

    //yoe multi by 0.5x, maxed at 1.2x boost)
    const yoeMatch = jobDescription.match(/(\d+)\+?\s*years/i);
    const requiredYoe = yoeMatch ? parseInt(yoeMatch[1], 10) : 0;
    const candidateYoe = candidate.basics?.totalYearsExperience || 0;
    
    let yoeMultiplier = 1.0;
    if (requiredYoe > 0) {
        yoeMultiplier = Math.max(0.5, Math.min(1.2, candidateYoe / requiredYoe));
    } else if (candidateYoe > 0) {
        yoeMultiplier = 1.1; 
    }

    // work exp by  +5% per role, max 1.15x
    const workCount = candidate.workExperience.length || 0;
    const workMultiplier = Math.min(1.15, 1.0 + (workCount * 0.05));

    // education multi 1.1x boost if they have a degree, else 1.0x)
    const eduCount = candidate?.education.length || 0;
    const eduMultiplier = eduCount > 0 ? 1.1 : 1.0;

    // projects by  +5% per proj, max 1.15x
    const projCount = candidate?.projects.length || 0;
    const projMultiplier = Math.min(1.15, 1.0 + (projCount * 0.05));

    // resume feedback Score multi 0.0x to 1.0x based on a 0-100 percent
    const cvScore = parseInt(candidate.feedback.overallMatch.score, 10) || 100; 
    const cvFeedbackMultiplier = cvScore / 100;

    let finalScore = Math.min(100, Math.round(overallScore * yoeMultiplier * workMultiplier * eduMultiplier * projMultiplier * cvFeedbackMultiplier));

    const multipliedMatched = {};
    const matchedKeys = Object.keys(skillsMatched);
    
    if (matchedKeys.length > 0) {
        const effectiveMultiplier = finalScore / overallScore;
        let currentSum = 0;

        matchedKeys.forEach((key, index) => {
        if (index === matchedKeys.length - 1) {

            multipliedMatched[key] = Math.round((finalScore - currentSum) * 10) / 10;
        } else {
            const scaledVal = Math.round(skillsMatched[key] * effectiveMultiplier * 10) / 10;
            multipliedMatched[key] = scaledVal;
            currentSum += scaledVal;
        }
        });
    }
    return {
        overallScore: finalScore,
        skillsMatched:{...multipliedMatched},
        missingSkills
    }
}