import express from 'express';
import { sendPasswordResetEmail } from '../middleware/mail.js';
import crypto from 'crypto';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, checkPassword } from '../middleware/encrypt.js';
import { validateInput, validateString } from '../middleware/routeFunctions.js';


export const getEmailRoutes = () => {

    const router = express.Router();

    // Request password reset
    router.post('/forgot-password', async (req, res) => {
        const { email } = req.body;


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
                    expires_at: new Date(),
                    used: false
                });
                if (result != null) {
                    try {
                        await sendPasswordResetEmail(email, token);
                        res.status(200).json({ message: 'Password reset email sent!' });
                        console.log('Email sent to:', email);
                    } catch (err) {
                        console.error(err);
                        res.status(401).json({ error: 'Failed to send email' });
                    }
                } else {
                    res.status(401).json({ error: 'Failed to create reset request' });
                }
            }
            else {
                /*Same response even if user does not exist, to avoid user enumeration*/
                res.status(200).json({ message: 'Password reset email sent!' });
            }
        

        } catch (error) {
            console.error('Error creating reset request', error);
            res.status(500).json('Error creating reset request');
        }

    });

    function isSameDay(d1, d2) {
        return d1.toDateString() === d2.toDateString();
    }

    router.post('/password-change', async (req, res) => {


        const { token, password } = req.body;

        try {
            const reset_request = await object.password_reset_requests.findOne({
                where: {
                    token: token,
                }
            });
            if (reset_request != null && isSameDay(reset_request.expires_at, new Date()) && !reset_request.used) {
                console.log(reset_request)
                const user_id = reset_request.user_id;
                const validateStr = validateString({ password });
                if (validateStr.valid) {
                    const hashedPassword = await hashPassword(password);
                    try {
                        if(password !== '') {
                            const result = await object.end_user.update({                        
                                password:hashedPassword
                            },
                            {
                                where: {
                                    id: user_id
                                }
                            }
                            );
                            if (result === null) {
                                return res.status(500).json('User not updated');
                            } else {
                                object.password_reset_requests.update(
                                    {used: true},
                                    {
                                        where: {
                                            token: token,
                                        }
                                    }
                                );
                                res.status(200).json({ message: 'Password changed' });
                            }
                        } else {
                            return res.status(400).json('Password cannot be empty');
                        }
        
                    } catch (error) {
                        console.error('Error updating password', error);
                        res.status(500).json('Internal Server Error');
                    }

                }
            }
            else {
                res.status(403).json({ message: 'Invalid token' });
            }
        

        } catch (error) {
            console.error('Error creating reset request', error);
            res.status(500).json('Error creating reset request');
        }

    });

    return router;
}
