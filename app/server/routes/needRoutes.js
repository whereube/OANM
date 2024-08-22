import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getNeedRoutes = () => {

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
        const validateStr = validateString({ title, description, available, location, link });
        const validateInt = validateInteger({ price });
        const validate = validateInput({ userId });

        if (validate.valid && validateStr.valid && validateInt.valid) {
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
        } else {
            res.status(400).json({ uuidError: validate.message, StrError: validateStr.message, IntError: validateInt.message }); 
        }
        
    });

  return router;
};