import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getNeedRoutes = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allNeeds = await object.needs.findAll({
        });
        res.status(200).send(allNeeds);
    });

    router.get('/byUserId/:userId', async (req, res, next) => {
        const userId  = req.params.userId; 
        const validate = validateInput({ userId });
        if (validate.valid) {
            const needs = await object.needs.findOne({
                where:{
                    user_id: userId
                }
            });
            res.status(200).send(needs);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });

    router.get('/byId/:needId', async (req, res, next) => {
        const needId  = req.params.needId; 
        const validate = validateInput({ needId });

        if (validate.valid) {
            const needs = await object.needs.findByPk(needId)
            res.status(200).send(needs);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });


    router.get('/byMeetingId/:meetingId', async (req, res, next) => {
        const meetingId  = req.params.meetingId; 
        const validate = validateInput({ meetingId });

        if (validate.valid) {
            const needs = await object.needs.findAll({
                include: object.end_user,
                where:{
                    meeting_id: meetingId
                }
            });
            res.status(200).send(needs);
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
            category_1,
            category_2,
            category_3,
            category_4,
            availableDigitaly,
            meetingId,
            articleCategories
        } = req.body;
        
        const id = uuidv4();
        const validateStr = validateString({ title, description, available, location });
        const validate = validateInput({ userId });

        if (validate.valid && validateStr.valid) {
            try {
                const result = await object.needs.create({
                    id,
                    user_id: userId,
                    title,
                    description, 
                    available, 
                    location,
                    price,
                    category_1,
                    category_2,
                    category_3,
                    category_4,
                    available_digitaly: availableDigitaly,
                    meeting_id: meetingId
                });
                
                if (result === null) {
                    return res.status(404).json('No new need created');
                } 
                for (const key in articleCategories) {
                    if (articleCategories.hasOwnProperty(key)) {
                        const articleCategoryResponse = await fetch(`${API_URL}/articleCategory/add`, {
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
                console.error('Error creating need', error);
                res.status(500).json('Internal Server Error');
            }    
        } else {
            res.status(400).json({ uuidError: validate.message, StrError: validateStr.message }); 
        }
        
    });

  return router;
};