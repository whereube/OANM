import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getCategoryRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allCategories = await object.category.findAll({
        });
        res.status(200).send(allCategories);
    });

    router.post('/addCategory', async (req, res, next) => {
      const {
          category_name,
          level,
          parent_id
      } = req.body;
      
      const id = uuidv4();

      const checkCategoryName = await object.category.findAll({
          where: {
              category_name: category_name
          }
      });

      if (checkCategoryName.length === 0){
          try {
              const result = await object.category.create({
                  id: id,
                  category_name: category_name,
                  level: 1,
                  parent_id: parent_id
              });
              
              if (result === null) {
                  return res.status(404).json({ message: 'No new category created' });
              } else{
                  res.status(201).json({ message: 'New category created'});
              }

          } catch (error) {
              console.error('Error creating category', error);
              res.status(500).json('Internal Server Error');
          }
      } else{
          return res.status(401).json({ message: 'category already exist' });
      }
  });

  router.delete('/deleteCategory', async (req, res, next) => {
    const { id } = req.body;
    
    const validate = validateInput({ id });

    if (validate.valid) {
      try {
        const result = await object.category.destroy({
          where: {
            id: id,
          }
        });
  
        if (result === 0) {
          return res.status(404).json({ message: 'Category not found' });
        }
        res.sendStatus(204);
      } catch (error) {
        console.error('Error deleting category', error);
        res.status(500).json('Internal Server Error');
      }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });


  return router;
};