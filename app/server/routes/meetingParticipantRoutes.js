import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getMeetingParticipantRoutes = () => {
    const router = Router();
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;


    router.get('/getByMeetingId', async (req, res, next) => {
        const data = await object.meetingParticipant.findAll({
        });
        res.status(200).send(data);
    });

    router.post('/add', async (req, res, next) => {
        const {
                meetingParticipants,
                meetingId, 
                standardPassword
        } = req.body;
        
        const allUsers = []
    
        try {
            const response = await fetch(`${API_URL}/user/getUser/byEmailList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emails: meetingParticipants })
            });
            const existingUsers = await response.json();
            for (const user of existingUsers){
                allUsers.push(user)
            }

            const nonExistingEmails = meetingParticipants.filter(email => 
                !existingUsers.some(existingUsers => existingUsers.email === email)
            );
            const createdEntries = [];
            for(const email of nonExistingEmails) {
                const response = await fetch(`${API_URL}/user/createBasicUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: standardPassword})
                });
                const createdUser = await response.json();
                createdEntries.push(createdUser['result']);
            };
            for (const user of createdEntries){
                allUsers.push(user)
            }

        } catch (error) {
            console.error('Error creating meeting user', error);
            res.status(500).json('Internal Server Error');
        }
        try {   
            let createdUsers = []
            for (const user of allUsers){
                const id = uuidv4();

                const createdUser = await object.meetingParticipant.create({
                id: id,
                meeting_id: meetingId,
                user_id: user.id
                });
                createdUsers.push(createdUser)
            }
            if (allUsers === null) {
                return res.status(404).json('No new user created');
            } else {
                res.status(201).json({createdUsers});
            }
        } catch (error) {
            console.error('Error creating meeting user', error);
            res.status(500).json('Internal Server Error');
        }

    });


  return router;
};