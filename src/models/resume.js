import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./users.js";

const Resume = sequelize.define('Resume', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  basics: {
    type: DataTypes.JSONB,
  },
  skills: {
    type: DataTypes.JSONB,
  },
  workExperience: {
    type: DataTypes.JSONB,
  },
  education: {
    type: DataTypes.JSONB,
  },
  projects: {
    type: DataTypes.JSONB,
  },
  certifications: {
    type: DataTypes.JSONB,
  },
  languages: {
    type: DataTypes.JSONB,
  },
  feedback: {
    type: DataTypes.JSONB,
  },
  keywords: {
    type: DataTypes.JSONB,
  }
}, {
  timestamps: true,
});
export default Resume;