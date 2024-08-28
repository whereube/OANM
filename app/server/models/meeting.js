import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const meeting = db.define(
    'meeting',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      meeting_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      // Other model are go here
      freezeTableName: true,
      updatedAt: false,
      createdAt: false,
    },
  );