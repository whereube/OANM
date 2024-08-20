import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';

export const getOfferRoutes = () => {

    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allOffers = await object.offers.findAll({
        });
        res.status(200).send(allOffers);
    });

    router.get('/byUserId/:userId', async (req, res, next) => {
        const userId  = req.params.userId; 
        const offers = await object.offers.findOne({
            where:{
                user_id: userId
            }
        });
        res.status(200).send(offers);
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
            link, 
            category_1,
            category_2,
            category_3,
            category_4
        } = req.body;
        
        const id = uuidv4();

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
                category_1,
                category_2,
                category_3,
                category_4
            });
            
            if (result === null) {
                return res.status(404).json('No new offer created');
            } else{
                res.status(201).json({ message: 'New offer created'});
            }

        } catch (error) {
            console.error('Error creating creator', error);
            res.status(500).json('Internal Server Error');
        }

    });

  return router;
};