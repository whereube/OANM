import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const password_reset_requests = db.define(
    'password_reset_requests',
    {     
        id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
        },
        user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        token: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        },
        used: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        }
    },
    {
      freezeTableName: true,
      updatedAt: false,
      createdAt: false,
    },
  );