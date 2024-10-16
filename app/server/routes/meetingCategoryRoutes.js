import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getMeetingCategoryRoutes = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const router = Router();
    router.get('/getAll', async (req, res, next) => {
        const data = await object.meetingCategory.findAll({
        });
        res.status(200).send(data);
    });

    router.post('/addMeetingAndCategory', async (req, res, next) => {
      const { meeting_name, category_id, meeting_id } = req.body; // assuming category_id is an array now
    
      // Ensure category_id is an array
      if (!Array.isArray(category_id) || category_id.length === 0) {
        return res.status(400).json({ message: 'category_id must be a non-empty array' });
      }
      try {
        // Make a request to the /addMeeting endpoint to create the meeting
        const meetingResponse = await fetch(`${API_URL}/meeting/addMeeting`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ meeting_name })
        });
    
        // Check if the meeting was created successfully
        if (!meetingResponse.ok) {
          const errorMessage = await meetingResponse.text();
          return res.status(meetingResponse.status).json({ message: errorMessage });
        }
        const meetingData = await meetingResponse.json();
        const newMeetingId = meetingData.meeting_id;
        
        const createdEntries = [];
        for (const catId of category_id) {
          const id = uuidv4();
    
          // Create each meetingCategory entry
          const result = await object.meetingCategory.create({
            id: id,
            meeting_id: newMeetingId,
            category_id: catId
          });
    
          createdEntries.push(result);
        }
    
        if (createdEntries.length === category_id.length) {
          res.status(201).json({ message: 'New meeting and categories created', createdEntries });
        } else {
          res.status(500).json({ message: 'Not all meeting categories were created successfully' });
        }
    
      } catch (error) {
        console.error('Error creating meeting and categories', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

    });

    router.get('/byMeetingId/:meetingId', async (req, res, next) => {
        const meetingId  = req.params.meetingId; 
        const data = await object.meetingCategory.findAll({
            include: object.category,
            where: {
                meeting_id: meetingId
            },
            order: [
                [{ model: object.category, as: 'category' }, 'category_name', 'ASC']
            ]
      });
        res.status(200).send(data);
    });


    router.post('/addCategories', async (req, res, next) => {
      const { category_id, meeting_id } = req.body; 
    
      // Ensure category_id is an array
      if (!Array.isArray(category_id) || category_id.length === 0) {
        return res.status(400).json({ message: 'category_id must be a non-empty array' });
      }
      try {
        const createdEntries = [];
        for (const catId of category_id) {
          const id = uuidv4();
    
          // Create each meetingCategory entry
          const result = await object.meetingCategory.create({
            id: id,
            meeting_id: meeting_id,
            category_id: catId
          });
    
          createdEntries.push(result);
        }
    
        if (createdEntries.length === category_id.length) {
          res.status(201).json({ message: 'New meeting and categories created', createdEntries });
        } else {
          res.status(500).json({ message: 'Not all meeting categories were created successfully' });
        }
    
      } catch (error) {
        console.error('Error creating meeting and categories', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

    });

    router.post('/removeCategories', async (req, res, next) => {
      const { category_id, meeting_id } = req.body; 

      const validate = validateInput({ meeting_id });

      if (validate.valid) {
        // Ensure category_id is an array
        if (!Array.isArray(category_id) || category_id.length === 0) {
          return res.status(400).json({ message: 'category_id must be a non-empty array' });
        }
        try {
          const removed = [];
          for (const catId of category_id) {    
            const result = await object.meetingCategory.destroy({
              where: {
                meeting_id: meeting_id,
                category_id: category_id
              },
            });
      
            removed.push(result);
          }
      
          if (removed.length === category_id.length) {
            res.status(201).json({ message: 'Categories removed' });
          } else {
            res.status(500).json({ message: 'Not all meeting categories were removed successfully' });
          }
      
        } catch (error) {
          console.error('Error removing meeting categories', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
          res.status(400).json({ message: validate.message});
      }

    });

  return router;
};