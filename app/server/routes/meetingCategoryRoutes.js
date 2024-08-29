import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getMeetingCategoryRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const data = await object.meetingCategory.findAll({
        });
        res.status(200).send(data);
    });

    router.get('/byMeetingId/:meetingId', async (req, res, next) => {
        const meetingId  = req.params.meetingId; 
        const data = await object.meetingCategory.findAll({
            include: object.category,
            where: {
                meeting_id: meetingId
            }
      });
        res.status(200).send(data);
    });


  return router;
};