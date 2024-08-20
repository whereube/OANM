import express from 'express';
import { getUserRoutes } from './routes/userRoutes.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';


export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);  // Use the CORS middleware globally
  app.use('/user',  getUserRoutes());



  return app;
};
