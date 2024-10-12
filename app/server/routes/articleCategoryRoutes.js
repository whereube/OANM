import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getArticleCategoryRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const data = await object.articleCategory.findAll({
        });
        res.status(200).send(data);
    });

    router.post('/add', async (req, res, next) => {
      const {
          articleId,
          categoryId
      } = req.body;
      
      const id = uuidv4();

      try {
        const result = await object.articleCategory.create({
            id: id,
            article_id: articleId,
            category_id: categoryId
        });
        
        if (result === null) {
            return res.status(404).json({ message: 'No new article category created' });
        } else{
            res.status(201).json({ message: 'New article category created'});
        }

      } catch (error) {
          console.error('Error creating category', error);
          res.status(500).json('Internal Server Error');
      }

    });

    router.delete('/removeAll/byArticleList', async (req, res, next) => {
        const {
            articles
        } = req.body;
        try {
            removedArticles = []
            for(const article in articles){
                const result = await object.articleCategory.destroy({
                    where: {
                        article_id: article.id
                    }
                });
                removedArticles.append(result)
            }
            if (result === null) {
                return res.status(404).json({ message: 'No article categories deleted' });
            } else{
                res.status(201).json({ message: 'All article categories deleted'});
            }

        } catch (error) {
            console.error('Error deleting needs', error);
            res.status(500).json('Internal Server Error');
        }

    });


  return router;
};