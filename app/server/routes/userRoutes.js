import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, checkPassword } from '../middleware/encrypt.js';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';

export const getUserRoutes = () => {
  const router = Router();

    router.get('/getUser/:id', async (req, res, next) => {
        const id = req.params.id;
        const validate = validateInput({ id });

        if (validate.valid) {
            try {
                const user = await object.end_user.findByPk(id);
                res.status(200).send(user);
            } catch (error) {
                console.error('Error creating company', error);
                res.status(500).json('Internal Server Error');
            }
        } else {
            res.status(400).json({ uuidError: validate.message }); 
        }
    });

    router.post('/login', async (req, res, next) => {
        const { email, password } = req.body;
        const user = await object.end_user.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            const checkedPassword = await checkPassword(password, user['dataValues']['password']);

            if (!checkedPassword) {
                res.status(401).json({ message: 'Wrong password' });
            } else if (user.length !== 0) {
                res.status(200).send(user);
            }
        } else {
            res.status(401).json({ message: 'Email does not exist' });
        }
        
    });

    router.get('/getAll', async (req, res, next) => {
        const allUsers = await object.end_user.findAll({
        });
        res.status(200).send(allUsers);
    });


    router.post('/isAdmin', async (req, res, next) => {
        const { userId } = req.body;
        const user = await object.end_user.findOne({
            where: {
                id: userId
            }
        });
        if (user !== null){
            let result = false
            if(user.is_admin !== null){
                if (user.is_admin){
                    result=true
                }
            }

            res.status(200).send(result);
        } else {
            res.status(200).send(false);
        }
    });

    router.post('/createUser', async (req, res, next) => {
        const {
            company_name,
            user_name,
            email,
            phone_number,
            link,
            password
        } = req.body;

        const validateStr = validateString({ company_name, user_name, email, link, password });

        if (validateStr.valid) {
            const checkCompanyName = await object.company.findOne({
                where: {
                    company_name: company_name
                }
            });

            const checkEmail = await object.end_user.findAll({
                where: {
                    email: email
                }
            });
            
            const NewCompanyId = uuidv4();

            if (!checkCompanyName && checkEmail.length === 0) {
                try {
                    const company = await object.company.create({
                        id: NewCompanyId,
                        company_name: company_name
                    });
                    
                    if (company === null) {
                        return res.status(404).json('No new company created');
                    } 

                } catch (error) {
                    console.error('Error creating company', error);
                    res.status(500).json('Internal Server Error');
                }
            }

            const user_id = uuidv4();
            const hashedPassword = await hashPassword(password);
    
            if (checkEmail.length === 0){
                try {
                    const result = await object.end_user.create({
                        id: user_id,
                        company_id: checkCompanyName ? checkCompanyName.id : NewCompanyId,
                        user_name: user_name,
                        email: email,
                        phone_number: phone_number,
                        link: link,
                        password:hashedPassword
                    });
                    
                    if (result === null) {
                        return res.status(404).json('No new user created');
                    } else {
                        res.status(201).json({result});
                    }
    
                } catch (error) {
                    console.error('Error creating user', error);
                    res.status(500).json('Internal Server Error');
                }
            } else{
                return res.status(401).json({ message: 'Email already exist' });
            }
        } else {
            return res.status(401).json({ message: 'Wrong data type' });
        }
    });


    router.post('/createBasicUser', async (req, res, next) => {
        const {
            email,
            password
        } = req.body;

        const validateStr = validateString({ email, password });

        if (validateStr.valid) {

            const checkEmail = await object.end_user.findAll({
                where: {
                    email: email
                }
            });
            
            const userId = uuidv4();
            const hashedPassword = await hashPassword(password);
            if (checkEmail.length === 0){
                try {
                    const result = await object.end_user.create({
                        id: userId,
                        password:hashedPassword,
                        user_name: email,
                        email: email,
                    });
                    
                    if (result === null) {
                        return res.status(404).json('No new user created');
                    } else {
                        res.status(201).json({result});
                    }
    
                } catch (error) {
                    console.error('Error creating user', error);
                    res.status(500).json('Internal Server Error');
                }
            } else{
                return res.status(401).json({ message: 'Email already exist' });
            }
        } else {
            return res.status(401).json({ message: 'Wrong data type' });
        }
    });


    router.post('/getUser/byEmailList', async (req, res, next) => {
        const {
            emails,
        } = req.body;
        try {
            const users = await object.end_user.findAll({
                where: {
                    email: emails
                }
            });
            res.status(200).send(users);

        } catch (error) {
            console.error('Error finding user', error);
            res.status(500).json('Internal Server Error');
        }
    });

    // router.put('/update', async (req, res, next) => {
    //     const {
    //         creator_id,
    //         username,
    //         email,
    //         password
    //     } = req.body;

    //     const hashedPassword = await hashPassword(password);

    //     try{
    //         const creatorToUpdate = await object.creator.findByPk(creator_id);

    //         creatorToUpdate.set({
    //             username: username,
    //             email: email,
    //             password: hashedPassword
    //         })

    //         await creatorToUpdate.save();
    //         res.status(200).json(creatorToUpdate);
    //     } catch (error) {
    //         console.error('Error updating creator', error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }  

    // });

    // router.delete('/delete', async (req, res, next) => {
    //     const { creator_id } = req.body;
    //     try {
    //         const result = await object.creator.destroy({
    //         where: {
    //             id: creator_id,
    //         }
    //         });
    
    //         if (result === 0) {
    //         return res.status(404).json({ message: 'Have not found' });
    //         } 
    //         res.sendStatus(204);
    //     } catch (error) {
    //     console.error('Error deleting creator', error);
    //     res.status(500).json('Internal Server Error');
    //     }
    // });

  return router;
};