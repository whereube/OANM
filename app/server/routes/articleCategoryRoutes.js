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


  return router;
};