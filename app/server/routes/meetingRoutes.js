import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getMeetingRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allMeetings = await object.meeting.findAll({
        });
        res.status(200).send(allMeetings);
    });

    router.post('/addMeeting', async (req, res, next) => {
      const {
          meeting_name
      } = req.body;
      
      const id = uuidv4();

      const checkMeetingName = await object.meeting.findAll({
          where: {
              meeting_name: meeting_name
          }
      });

      if (checkMeetingName.length === 0){
          try {
              const result = await object.meeting.create({
                  id: id,
                  meeting_name: meeting_name
              });
              
              if (result === null) {
                  return res.status(404).json({ message: 'No new meeting created' });
              } else{
                  res.status(201).json({ message: 'New meeting created'});
              }

          } catch (error) {
              console.error('Error creating meeting', error);
              res.status(500).json('Internal Server Error');
          }
      } else{
          return res.status(401).json('Meeting already exist');
      }
  });



  return router;
};