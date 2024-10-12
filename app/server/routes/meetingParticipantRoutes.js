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

    router.get('/getByUserId/:userId', async (req, res, next) => {
        const userId  = req.params.userId; 
        console.log(userId)
        const data = await object.meetingParticipant.findAll({
            where:{
                user_id: userId
            }
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

            let alreadyInMeetingParticipant = []
            let createdUsers = []

            for (const user of allUsers){
                const alreadyExisting = await object.meetingParticipant.findOne({
                    where:{
                        meeting_id: meetingId,
                        user_id: user.id
                    }
                });
                if (alreadyExisting !== null){
                    alreadyInMeetingParticipant.push(alreadyExisting.dataValues.user_id)
                }
            }

            const notAlreadyInMeeting = allUsers.filter(user => !alreadyInMeetingParticipant.includes(user.id));

            for (const user of notAlreadyInMeeting){
                const id = uuidv4();

                const createdUser = await object.meetingParticipant.create({
                id: id,
                meeting_id: meetingId,
                user_id: user.id
                });
                createdUsers.push(createdUser)
            }
            if (notAlreadyInMeeting.createdUser === 0) {
                return res.status(404).json('No new user created');
            } else {
                res.status(201).json({createdUsers});
            }
        } catch (error) {
            console.error('Error creating meeting user', error);
            res.status(500).json('Internal Server Error');
        }

    });

    router.post('/removeAll/byUserId', async (req, res, next) => {
        const { userId } = req.body;
        try {
            const result = await object.meetingParticipant.destroy({
                where: {
                    user_id: userId
                }
            });

            if (result === 0) {
                return res.status(404).json({ message: 'No meeting participants found to delete' });
            } else {
                return res.status(200).json({ message: 'All participations deleted' })
            }

        } catch (error) {
            console.error('Error deleting meeting participants', error);
            return res.status(500).json('Internal Server Error');
        }
    });


  return router;
};