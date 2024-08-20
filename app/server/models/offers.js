import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { category } from './category.js';

export const needs = db.define(
    'needs',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      available: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category_1: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      category_2: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      category_3: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      category_4: {
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