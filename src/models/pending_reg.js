import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PendingRegistrations = sequelize.define("PendingRegistrations", 
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('candidate', 'recruiter'),
            allowNull: false,
            defaultValue: "candidate",
        },
        hasResume: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        otpHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpExpiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, 
    {
        tableName: 'pending_registrations',
        timestamps: true,
    }
);
export default PendingRegistrations;