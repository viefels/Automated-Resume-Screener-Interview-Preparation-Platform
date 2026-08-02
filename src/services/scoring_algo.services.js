const CAND_CV_PATH = path.join(import.meta.dirname, "../data/candidates_resume.json");
const USERS_PATH =  path.join(import.meta.dirname, "../data/candidates_basics.json");
const RECRUITER_JOBS_PATH = path.join(import.meta.dirname, "../data/jobs.json");


const CAND_CV = JSON.parse(await fs.readFile(CAND_CV_PATH, "utf8"));
const USERS = JSON.parse(await fs.readFile(USERS_PATH, "utf8"));
const JOBS = JSON.parse(await fs.readFile(RECRUITER_JOBS_PATH, "utf8"));

const keywords = new Set();

JOBS.forEach()

export default async function getScores(){

}