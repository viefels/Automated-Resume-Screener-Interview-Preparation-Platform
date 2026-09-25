import sequelize from "../config/database.js";
import { configDotenv } from "dotenv";
import path from 'node:path';
import Job from './job.js';
import User from './users.js';
import JobQuestion from './job_question.js';
import Resume from './resume.js';
import PendingRegistrations from "./pending_reg.js";
configDotenv({ path: path.join(import.meta.dirname, "../../.env") });




// Relationships
User.hasOne(Resume, { foreignKey: 'userId', as: 'resume' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Job, { foreignKey: 'recruiterId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

Job.hasOne(JobQuestion, { foreignKey: 'jobId', as: 'jobQuestions' });
JobQuestion.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

export { sequelize, User, Resume, Job, JobQuestion, PendingRegistrations };
