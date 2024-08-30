import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getOfferRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allOffers = await object.offers.findAll({
        });
        res.status(200).send(allOffers);
    });

    router.get('/byUserId/:userId', async (req, res, next) => {
        const userId  = req.params.userId; 
        const validate = validateInput({ userId });

        if (validate.valid) {
            const offers = await object.offers.findOne({
                where:{
                    user_id: userId
                }
            });
            res.status(200).send(offers);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });


    router.get('/byId/:offerId', async (req, res, next) => {
        const offerId  = req.params.offerId; 
        const validate = validateInput({ offerId });

        if (validate.valid) {
            const offers = await object.offers.findByPk(offerId)
            res.status(200).send(offers);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });


    router.get('/byMeetingId/:meetingId', async (req, res, next) => {
        const meetingId  = req.params.meetingId; 
        const validate = validateInput({ meetingId });

        if (validate.valid) {
            const offers = await object.offers.findAll({
                include: object.end_user,
                where:{
                    meeting_id: meetingId
                }
            });
            res.status(200).send(offers);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });


    router.post('/add', async (req, res, next) => {
        const {
            userId,
            title,
            description, 
            available, 
            location,
            price,
            link, 
            availableDigitaly,
            meetingId,
            articleCategories
        } = req.body;
        
        const id = uuidv4();
        const validateStr = validateString({ title, description, available, location, link });
        const validateInt = validateInteger({ price });
        const validate = validateInput({ userId });

        if (validate.valid && validateStr.valid && validateInt.valid) {
            try {
                const result = await object.offers.create({
                    id,
                    user_id: userId,
                    title,
                    description, 
                    available, 
                    location,
                    price,
                    link,
                    available_digitaly: availableDigitaly,
                    meeting_id: meetingId
                });

                if (result === null) {
                    return res.status(404).json('No new article category created');
                }

                for (const key in articleCategories) {
                    if (articleCategories.hasOwnProperty(key)) {
                        const articleCategoryResponse = await fetch('http://localhost:443/articleCategory/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ 'articleId': id, 'categoryId': articleCategories[key] })
                        });
                        
                        if (articleCategoryResponse === null) {
                            return res.status(404).json('No new article category created');
                        }
                    }
                }

                res.status(201).json({ message: 'New article category created'});
    
            } catch (error) {
                console.error('Error creating offer', error);
                res.status(500).json('Internal Server Error');
            }
        } else {
            res.status(400).json({ uuidError: validate.message, StrError: validateStr.message, IntError: validateInt.message }); 
        }
    });

  return router;
};