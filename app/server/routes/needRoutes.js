import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';

export const getNeedRoutes = () => {

    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allNeeds = await object.needs.findAll({
        });
        res.status(200).send(allNeeds);
    });

    router.get('/byUserId/:userId', async (req, res, next) => {
        const userId  = req.params.userId; 
        const needs = await object.needs.findOne({
            where:{
                user_id: userId
            }
        });
        res.status(200).send(needs);
    });


    //Function for updating have based on singular article_id
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
            category_4
        } = req.body;
        
        const id = uuidv4();

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
                category_4
            });
            
            if (result === null) {
                return res.status(404).json('No new need created');
            } else{
                res.status(201).json({ message: 'New need created'});
            }

        } catch (error) {
            console.error('Error creating need', error);
            res.status(500).json('Internal Server Error');
        }

    });

  return router;
};