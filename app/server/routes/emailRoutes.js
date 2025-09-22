import express from 'express';
import { sendPasswordResetEmail } from '../middleware/mail.js';
import crypto from 'crypto';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';

export const getEmailRoutes = () => {

    const router = express.Router();

    // Request password reset
    router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // TODO: check if user exists in DB

    // TODO: save token + expiration in DB for this user
    const token = uuidv4();

    try {
        const user = await object.end_user.findOne({
            where: {
                email: email,
            }
        });
        if (user != null) {
            const result = await object.password_reset_requests.create({
                id: uuidv4(),
                user_id: user.id,
                token: token,
                expires_at: new Date()
            });
            if (result != null) {
                try {
                    await sendPasswordResetEmail(email, token);
                    res.json({ message: 'Password reset email sent!' });
                    console.log('Email sent to:', email);
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to send email' });
                }
            }
        }
        else {
            return res.status(404).json({ message: 'No user with this email exists' });
        }
    

    } catch (error) {
        console.error('Error creating reset request', error);
        res.status(500).json('Error creating reset request');
    }

    });
    return router;
}
