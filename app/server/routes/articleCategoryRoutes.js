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

    router.get('/ByArticleId/:articleId', async (req, res, next) => {
        const { articleId } = req.params;

        const data = await object.articleCategory.findAll({
            where: {
                article_id: articleId
            }
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

    router.delete('/removeCategories', async (req, res, next) => {
      const { categoryIds, articleId } = req.body; 

      const validate = validateInput({ articleId });

      if (validate.valid) {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
          return res.status(400).json({ message: 'category_id must be a non-empty array' });
        }
        try {
          const removed = [];
          for (const catId of categoryIds) {    
            const result = await object.articleCategory.destroy({
              where: {
                article_id: articleId,
                category_id: catId
              },
            });
      
            removed.push(result);
          }
      
          if (removed.length === categoryIds.length) {
            res.status(201).json({ message: 'Categories removed' });
          } else {
            res.status(500).json({ message: 'Not all categories were removed successfully' });
          }
      
        } catch (error) {
          console.error('Error removing categories', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
          res.status(400).json({ message: validate.message});
      }

    });


    router.post('/addCategoriesByList', async (req, res, next) => {
      const { categoryIds, articleId } = req.body; 
    
      const validate = validateInput({ articleId });

      // Ensure category_id is an array
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ message: 'category_id must be a non-empty array' });
      }
      try {
        const createdEntries = [];
        for (const catId of categoryIds) {
          const id = uuidv4();
    
          // Create each meetingCategory entry
          const result = await object.articleCategory.create({
            id: id,
            article_id: articleId,
            category_id: catId
          });
    
          createdEntries.push(result);
        }
    
        if (createdEntries.length === categoryIds.length) {
          res.status(201).json({ message: 'New categories added', createdEntries });
        } else {
          res.status(500).json({ message: 'Not all categories were added successfully' });
        }
    
      } catch (error) {
        console.error('Error adding categories', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

    });


  return router;
};