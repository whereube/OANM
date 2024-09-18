import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const articleInterest = db.define(
    'article_interest',
    {     
        id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
        },
        article_id: {
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