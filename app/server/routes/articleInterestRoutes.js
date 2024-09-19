import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getArticleInterestRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const data = await object.articleInterest.findAll({
        });
        res.status(200).send(data);
    });

    router.post('/add', async (req, res, next) => {
      const {
          articleId,
          userId
      } = req.body;
      
      const id = uuidv4();

      try {
        const result = await object.articleInterest.create({
            id: id,
            article_id: articleId,
            user_id: userId
        });
        
        if (result === null) {
            return res.status(404).json({ message: 'No new article interest created' });
        } else{
            res.status(201).json({ message: 'New article interest created'});
        }

      } catch (error) {
          console.error('Error creating category', error);
          res.status(500).json('Internal Server Error');
      }

    });


    router.post('/remove', async (req, res, next) => {
        const {
            interestId,
            userId
        } = req.body;

        try {
        const result = await object.articleInterest.destroy({
            where: {
                id: interestId,
                user_id: userId
            }
        });
        
        if (result === null) {
            return res.status(404).json({ message: 'No article interest removed' });
        } else{
            res.status(201).json({ message: 'Article interest removed'});
        }

        } catch (error) {
            console.error('Error creating category', error);
            res.status(500).json('Internal Server Error');
        }

    });


  return router;
};