import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./users.js";


const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  recruiterId: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'id'
    }
  },
  jobTitle: {
    type: DataTypes.STRING,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  jobDescription: {
    type: DataTypes.TEXT,
  },
  salaryRange: {
    type: DataTypes.JSONB,
  },
  location: {
    type: DataTypes.STRING,
  },
  keywords: {
    type: DataTypes.JSONB,
  },
  jobType:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Remote',
  }
}, {
  timestamps: true,
});
export default Job;