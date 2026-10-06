const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define(
    'Enrollment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                'active',
                'completed',
                'cancelled'
            ),
            allowNull: false,
            defaultValue: 'active'
        },

        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100
            }
        },

        enrolledAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, 
    {
        tableName: 'enrollments',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'courseId']
            }
        ]
    }
);

module.exports = Enrollment;