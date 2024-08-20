import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getCompanyRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const allOffers = await object.company.findAll({
        });
        res.status(200).send(allOffers);
    });

    router.get('/getCompany/:id', async (req, res, next) => {
        const companyId  = req.params.id; 
        const validate = validateInput({ companyId });

        if (validate.valid) {
            const offers = await object.company.findOne({
                where:{
                    id: companyId
                }
            });
            res.status(200).send(offers);
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });

    router.post('/createCompany', async (req, res, next) => {
        const { company_name } = req.body;

        const validateStr = validateString({ company_name });

        if (validateStr.valid) {
            const checkCompanyName = await object.company.findOne({
                where: {
                    company_name: company_name
                }
            });
            
            const NewCompanyId = uuidv4();

            if (!checkCompanyName) {
                try {
                    const company = await object.company.create({
                        id: NewCompanyId,
                        company_name: company_name
                    });
                    
                    if (company === null) {
                        return res.status(404).json('No new company created');
                    } else {
                        return res.status(200).json('Company created');
                    }

                } catch (error) {
                    console.error('Error creating company', error);
                    res.status(500).json('Internal Server Error');
                }
            } else {
                return res.status(404).json('Company already exist');
            }
        } else {
            res.status(400).json({ uuidError: validateStr.message }); 
        }
    });

  return router;
};