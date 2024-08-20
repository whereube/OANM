import express from 'express';
import { getRecipeRoutes } from './routes/recipeRoutes.js';

import { corsMiddleware } from './middleware/corsMiddleware.js';


export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);  // Use the CORS middleware globally
//   app.use(authenticateUser);
  app.use('/recipe',  getRecipeRoutes());
  app.use('/creator',  getCreatorRoutes());
  app.use('/step',  getStepRoutes());
  app.use('/ingredient',  getIngredientRoutes());


  return app;
};
