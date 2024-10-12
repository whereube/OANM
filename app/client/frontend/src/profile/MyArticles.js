import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HandleOffers from '../offers/HandleOffers';
import HandleNeeds from '../needs/HandleNeeds';
import { useAuth } from '../auth/AuthProvider';



const MyArticles = () => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const { getUsersOwnOffers } = HandleOffers();
    const { getUsersOwnNeeds } = HandleNeeds()
    const { user } = useAuth();
    const [ownOffers, setOwnOffers] = useState([]);
    const [ownNeeds, setOwnNeeds] = useState([]);
    const [allArticleIds, setAllArticleIds] = useState([])
    const [articleInterest, setArticleInterest] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        getUsersOwnOffers(setOwnOffers, user.userId);
        getUsersOwnNeeds(setOwnNeeds, user.userId);
    }, []);


    useEffect(() => {
        const articleIds = [] 
        for(const offer of ownOffers){
            articleIds.push(offer.id)
        }
        for(const need of ownNeeds){
            articleIds.push(need.id)
        }
        setAllArticleIds(articleIds)
    }, [ownOffers]);

    useEffect(() => {
        console.log(articleInterest)
    }, [articleInterest]);

    useEffect(() => {
        const fetchArticleInterest = async () => {
            if(allArticleIds.length > 0){
                try{
                    const response = await fetch(`${API_URL}/articleInterest/getAll/fromArticleList`, {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({articleList: allArticleIds}),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch article interest');
                    }
                    const data = await response.json();
                    console.log(data)
                    setArticleInterest(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching interest:', error);
                    setLoading(false);
                }
            }
        }

        fetchArticleInterest();
    }, [allArticleIds]);

    return (
        <div>
            <h2>Erbjudanden</h2>
            {ownOffers.map(article => (
                <div key={article.id}>
                    <p>{article.title}</p>
                    <input
                        readOnly
                        value={articleInterest
                        .filter(interest => interest.article_id === article.id)
                        .map(interest => interest.end_user.email)
                        .join('; ')}
                    />
                </div>
            ))}
            <h2>Behov</h2>
            {ownNeeds.map(article => (
                <div key={article.id}>
                    <p>{article.title}</p>
                    <input
                        readOnly
                        value={articleInterest
                        .filter(interest => interest.article_id === article.id)
                        .map(interest => interest.end_user.email)
                        .join('; ')}
                    />
                </div>
            ))}
        </div>
    );
};

export default MyArticles;
