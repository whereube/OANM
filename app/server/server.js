import express from 'express';
import { getUserRoutes } from './routes/userRoutes.js';
import { getOfferRoutes } from './routes/offerRoutes.js';
import { getNeedRoutes } from './routes/needRoutes.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { getCompanyRoutes } from './routes/companyRoutes.js';
import { getCategoryRoutes } from './routes/categoryRoutes.js';
import { getMeetingRoutes } from './routes/meetingRoutes.js';
import { getArticleCategoryRoutes } from './routes/articleCategoryRoutes.js';
import { getMeetingCategoryRoutes } from './routes/meetingCategoryRoutes.js';
import { getArticleInterestRoutes } from './routes/articleInterestRoutes.js';
import { getMeetingParticipantRoutes } from './routes/meetingParticipantRoutes.js';
export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);  // Use the CORS middleware globally

  app.use('/api/user',  getUserRoutes());
  app.use('/api/offers',  getOfferRoutes());
  app.use('/api/needs', getNeedRoutes());
  app.use('/api/company', getCompanyRoutes());
  app.use('/api/category', getCategoryRoutes());
  app.use('/api/meeting', getMeetingRoutes());
  app.use('/api/articleCategory', getArticleCategoryRoutes());
  app.use('/api/meetingCategory', getMeetingCategoryRoutes());
  app.use('/api/articleInterest', getArticleInterestRoutes());
  app.use('/api/meetingParticipant', getMeetingParticipantRoutes());


  return app;
};
