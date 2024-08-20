import express from 'express';
import { getUserRoutes } from './routes/userRoutes.js';
import { getOfferRoutes } from './routes/offerRoutes.js';
import { getNeedRoutes } from './routes/needRoutes.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { getCompanyRoutes } from './routes/companyRoutes.js';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);  // Use the CORS middleware globally

  app.use('/user',  getUserRoutes());
  app.use('/offers',  getOfferRoutes());
  app.use('/needs', getNeedRoutes());
  app.use('/company', getCompanyRoutes());

  return app;
};
