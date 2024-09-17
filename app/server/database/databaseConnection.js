import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Check if the app is running in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Use DATABASE_URL if in production (Heroku environment) or fallback to individual environment variables
const dbUrl = process.env.DATABASE_URL;

const getDBName = process.env.DB_NAME;
const getDBUser = process.env.DB_USER;
const getDBPassword = process.env.DB_PASSWORD;
const getDBHost = process.env.DB_HOST;
const getDBPort = process.env.DB_PORT;

const connectToDatabase = async () => {
  let db;

  // For production, use the Heroku PostgreSQL URL
  if (isProduction && dbUrl) {
    db = new Sequelize(dbUrl, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,  // Disable logging in production
      pool: {
        max: 90,
        min: 0,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,  // Important for Heroku's self-signed certificates
        },
      },
    });
  } else {
    // For development or local use, use individual environment variables
    db = new Sequelize(getDBName, getDBUser, getDBPassword, {
      host: getDBHost,
      dialect: 'postgres',
      port: getDBPort,
      pool: {
        max: 90,
        min: 0,
      },
    });
  }

  try {
    await db.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return db;
};

export const getTransaction = async () => {
  const transaction = await db.transaction();
  return transaction;
};

// Connect to the database
export const db = await connectToDatabase();
