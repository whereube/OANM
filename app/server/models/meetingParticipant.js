import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const meetingParticipant = db.define(
    'meeting_participant',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      meeting_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
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