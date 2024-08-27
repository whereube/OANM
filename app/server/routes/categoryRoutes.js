import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getCategoryRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allOffers = await object.company.findAll({
        });
        res.status(200).send(allOffers);
    });


  return router;
};