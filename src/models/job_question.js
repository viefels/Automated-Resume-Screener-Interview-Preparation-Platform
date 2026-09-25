import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Job from "./job.js";

const JobQuestion = sequelize.define('JobQuestion', {
  jobId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: Job,
      key: 'id'
    }
  },
  questions: {
    type: DataTypes.JSONB,
  }
}, {
  timestamps: false,
});

export default JobQuestion;