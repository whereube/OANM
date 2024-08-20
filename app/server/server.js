import express from 'express';
import { getEndUserRoutes } from './routes/userRoutes.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';


export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);  // Use the CORS middleware globally
//   app.use(authenticateUser);
  app.use('/recipe',  getRecipeRoutes());
  app.use('/creator',  getUserRoutes());
  app.use('/step',  getStepRoutes());
  app.use('/ingredient',  getIngredientRoutes());


  return app;
};
