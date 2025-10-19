import { Router } from 'express';
import { Sequelize } from 'sequelize';
import * as object from '../models/objectIndex.js';
import { v4 as uuidv4 } from 'uuid';
import { validateInput, validateString, validateInteger } from '../middleware/routeFunctions.js';
import { sendInterestNotification } from '../middleware/mail.js';


export const getArticleInterestRoutes = () => {
    const router = Router();

    router.get('/getAll', async (req, res, next) => {
        const data = await object.articleInterest.findAll({
        });
        res.status(200).send(data);
    });


    router.post('/getAll/fromArticleList', async (req, res, next) => {
        const {
            articleList,
        } = req.body;
        const data = await object.articleInterest.findAll({
            where: {
                article_id: {
                    [Sequelize.Op.in]: articleList
                }
            },
            include: [{
                model: object.end_user,
                attributes: ['email']
            }]
        });
        res.status(200).send(data);
    });


    router.post('/add', async (req, res, next) => {
      const {
          articleId,
          userId
      } = req.body;
      
      const id = uuidv4();

      try {
        const result = await object.articleInterest.create({
            id: id,
            article_id: articleId,
            user_id: userId
        });
        
        if (result === null) {
            return res.status(404).json({ message: 'No new article interest created' });
        } else{
            res.status(201).json({ message: 'New article interest created'});
            // CALL the function to send email notification here
            const articleInfo = await object.offers.findOne({
                where: {
                    id: articleId
                },
                include: [{
                    model: object.end_user,
                    attributes: ['email', "id", "no_email_notification"]
                }]
            });
            const allInterested = await object.articleInterest.findAll({
                where: {
                    article_id: articleId
                },
                include: [{
                    model: object.end_user,
                    attributes: ['email']
                }]
            });
            if(articleInfo.end_user.no_email_notification){
                return; // Do not send email if user has unsubscribed
            } else {
                await sendInterestNotification(articleInfo.end_user.email, articleInfo.title, allInterested.map(i => i.end_user.email).join('; '), articleId, articleInfo.end_user.id);
            }       
    }

      } catch (error) {
          console.error('Error adding interest', error);
          //res.status(500).json('Internal Server Error');
      }

    });


    router.post('/remove', async (req, res, next) => {
        const {
            interestId,
            userId
        } = req.body;

        try {
        const result = await object.articleInterest.destroy({
            where: {
                id: interestId,
                user_id: userId
            }
        });
        
        if (result === null) {
            return res.status(404).json({ message: 'No article interest removed' });
        } else{
            res.status(201).json({ message: 'Article interest removed'});
        }

        } catch (error) {
            console.error('Error removing interest', error);
            res.status(500).json('Internal Server Error');
        }

    });

    router.post('/removeAll/byUserId', async (req, res, next) => {
        const {
            userId
        } = req.body;

        try {
        const result = await object.articleInterest.destroy({
            where: {
                user_id: userId
            }
        });
        
        if (result === null) {
            return res.status(404).json({ message: 'No article interest removed' });
        } else{
            res.status(201).json({ message: 'All interests removed'});
        }

        } catch (error) {
            console.error('Error deleting interests', error);
            res.status(500).json('Internal Server Error');
        }

    });


  return router;
};