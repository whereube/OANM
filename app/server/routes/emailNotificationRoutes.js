import express from 'express';
import crypto from 'crypto';
import * as object from '../models/objectIndex.js';



export const getEmailNotificationRoutes = () => {

    const router = express.Router();

    router.post('/unsubscribe', async (req, res) => {

        const { userId } = req.body;
        console.log('Received unsubscribe request for userId:', userId);
        try {
            const updated_user = await object.end_user.update({                        
                no_email_notification: true
            },
            {
                where: {
                    id: userId,
                }
            });
            console.log('Updated user:', updated_user);
            if (updated_user[0] === 0) {
                return res.status(500).json('User not updated');
            } else {
                res.status(200).json({ message: 'Notification preference changed' });
            }

        } catch (error) {
            console.error('Error updating email preference', error);
            res.status(500).json('Internal Server Error');
        }
    });

    return router;
}
