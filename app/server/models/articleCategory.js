import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const articleCategory = db.define(
    'article_category',
    {
      article_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      category_id: {
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