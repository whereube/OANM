import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const category = db.define(
    'category',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      }
    },
    {
      // Other model are go here
      freezeTableName: true,
      updatedAt: false,
      createdAt: false,
    },
  );