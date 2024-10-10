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
                  res.status(201).json({ meeting_id: id });
              }

          } catch (error) {
              console.error('Error creating meeting', error);
              res.status(500).json('Internal Server Error');
          }
      } else{
          return res.status(401).json({ message: 'No new meeting created' });
      }
    });


    router.get('/ById/:meetingId', async (req, res, next) => {
        const meetingId  = req.params.meetingId; 
        const validate = validateInput({ meetingId });

        if (validate.valid) {
            try {
                const meetingData = await object.meeting.findByPk(meetingId);
                res.status(200).send(meetingData);
            } catch (error) {
                console.error('Error fetching meeting data', error);
                res.status(500).json('Internal Server Error');
            }
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });

    router.put('/editMeeting', async (req, res, next) => {
        const {
            meeting_name,
            meeting_id
        } = req.body;

        const checkMeetingName = await object.meeting.findAll({
            where: {
                meeting_name: meeting_name
            }
        });
        if (checkMeetingName.length === 0){
            try {
                const result = await object.meeting.update(
                    { meeting_name: meeting_name },
                    {
                        where: {
                            id: meeting_id,
                        }
                    }
                );
                
                if (result === 0) {
                    return res.status(404).json({ message: 'Meeting info not updated' });
                } else {
                    res.status(201).json(result);
                }

            } catch (error) {
                console.error('Error updating meeting info', error);
                res.status(500).json('Internal Server Error');
            }
        } else{
            return res.status(401).json('Meeting name is already in use');
        }
    });



  return router;
};