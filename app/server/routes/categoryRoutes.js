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

  router.delete('/deleteCategory/:id', async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    // Validate the ID
    const validate = validateInput({ id });

    if (validate.valid) {
        try {
            // Step 1: Delete related entries from the 'meeting_category' table
            const meetingCategoryResult = await object.meetingCategory.destroy({
                where: {
                    category_id: id, // Match category_id with the id of the category being deleted
                },
            });

            // Step 2: Delete the category from the 'category' table
            const categoryResult = await object.category.destroy({
                where: {
                    id: id,
                },
            });

            if (categoryResult === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.sendStatus(204); // No content to send back
        } catch (error) {
            console.error('Error deleting category or related meeting categories:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ message: validate.message });
    }
});

  


  return router;
};