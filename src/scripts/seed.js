import fs from 'node:fs/promises';
import path from 'node:path';
import { sequelize, User, Resume, Job, JobQuestion } from '../models/index.js';

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Database synced');

  const USERS_PATH = path.join(import.meta.dirname, "../data/candidates_basics.json");
  const users = JSON.parse(await fs.readFile(USERS_PATH, "utf8"));
  for (const u of users) {
    await User.create(u);
  }
  console.log('Users seeded');

  const CAND_CV_PATH = path.join(import.meta.dirname, "../data/candidates_resume.json");
  const resumes = JSON.parse(await fs.readFile(CAND_CV_PATH, "utf8"));
  for (const r of resumes) {
    if (r.id) {
      r.userId = r.id; // Map id to userId
      await Resume.create(r);
    }
  }
  console.log('Resumes seeded');

  const JOBS_PATH = path.join(import.meta.dirname, "../data/jobs.json");
  const jobs = JSON.parse(await fs.readFile(JOBS_PATH, "utf8"));
  for (const j of jobs) {
    await Job.create(j);
  }
  console.log('Jobs seeded');

  const QUESTIONS_PATH = path.join(import.meta.dirname, "../data/questions.json");
  const questions = JSON.parse(await fs.readFile(QUESTIONS_PATH, "utf8"));
  for (const q of questions) {
    await JobQuestion.create(q);
  }
  console.log('Questions seeded');

  console.log('Seeding complete');
}

seed().catch(err => {
  console.error('Failed to seed:', err);
});
