import express from 'express';
import { sendPasswordResetEmail } from '../middleware/mail.js';
import crypto from 'crypto';

export const getEmailRoutes = () => {

    const router = express.Router();

    // Request password reset
    router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // TODO: check if user exists in DB
    // For demo, we just generate a token
    const token = crypto.randomBytes(32).toString('hex');

    // TODO: save token + expiration in DB for this user

    try {
        await sendPasswordResetEmail(email, token);
        res.json({ message: 'Password reset email sent!' });
        console.log('Email sent to:', email);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send email' });
    }
    });
    return router;
}
