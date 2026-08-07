import { Sequelize, DataTypes } from 'sequelize';
import { configDotenv } from "dotenv";
configDotenv({ path: "../../.env" });


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
);


const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('candidate', 'recruiter'),
    allowNull: false,
  },
  hasResume: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resumeOverview: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  timestamps: true,
});

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

// Relationships
User.hasOne(Resume, { foreignKey: 'userId', as: 'resume' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Job, { foreignKey: 'recruiterId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

Job.hasOne(JobQuestion, { foreignKey: 'jobId', as: 'jobQuestions' });
JobQuestion.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

export { sequelize, User, Resume, Job, JobQuestion };
