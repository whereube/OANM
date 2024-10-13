import { Router } from 'express';
import { Sequelize } from 'sequelize';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';
import { db } from '../database/databaseConnection.js';


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
            const needs = await db.query(
                `SELECT * FROM needs
                where exists (
                    select * from meeting_participant mp 
                    where needs.meeting_id = mp.meeting_id
                    and mp.user_id = :userId
                )`,
                {
                    replacements: { userId: userId }, 
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            res.status(200).send(needs);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });

    router.get('/usersOwnNeeds/:userId', async (req, res, next) => {
        const userId  = req.params.userId; 
        const validate = validateInput({ userId });

        if (validate.valid) {
            const needs = await object.needs.findAll({
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
            const needs = await object.needs.findByPk(needId,  {
                include: [{
                    model: object.end_user,
                    attributes: { 
                    exclude: ['password'] 
                    }
                }]
            })
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


    router.post('/removeAll/byUserId', async (req, res, next) => {
        const {
            userId
        } = req.body;

        try {
            const userArticles = await object.needs.findAll({
                where: {
                    user_id: userId
                }
            })

            await fetch(`${API_URL}/user/articleCategory/removeAll/byArticleList`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userArticles })
            });


            const result = await object.needs.destroy({
                where: {
                    user_id: userId
                }
            });
            
            if (result === null) {
                return res.status(404).json({ message: 'No needs deleted' });
            } else{
                res.status(201).json({ message: 'All users needs deleted'});
            }

        } catch (error) {
            console.error('Error deleting needs', error);
            res.status(500).json('Internal Server Error');
        }

    });

    router.post('/edit', async (req, res, next) => {
        const {
            articleId,
            title,
            description, 
        } = req.body;
        
        const validateStr = validateString({ title, description });
        const validate = validateInput({ articleId });

        if (validate.valid && validateStr.valid) {
            try {
                const result = await object.needs.update(
                    {
                        title,
                        description
                    },
                    {
                        where: {
                            id: articleId,
                        }
                    }
                );

                if (result === 0) {
                    return res.status(404).json('Article not updated');
                } else{
                    res.status(201).json({ message: 'Article updated'});
                }
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