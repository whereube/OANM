import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HandleOffers from '../offers/HandleOffers';
import HandleNeeds from '../needs/HandleNeeds';
import { useAuth } from '../auth/AuthProvider';
import './MyArticles.css'



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
    const [viewOffers, setViewOffers] = useState(true);



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

    const toggleOffersOrNeeds = (displayOffers) => {
        setViewOffers(displayOffers)
    }

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
        <div className='myArticlesDiv'>
            <div className='showOffersOrNeeds'>
                <div className='buttonsDiv'>
                    <p className={`OfferOrNeedButton ${viewOffers && 'active'} `} onClick={() => toggleOffersOrNeeds(true)}>Erbjudanden</p>
                    <p className={`OfferOrNeedButton ${viewOffers === false && 'active'} `} onClick={() => toggleOffersOrNeeds(false)}>Behov</p>
                </div>
            </div>
            {viewOffers ? (
                <h1>Mina erbjudanden</h1>
            ):(
                <h1>Mina behov</h1>
            )}
            <table className='articleTable'>
                <thead>
                    <tr>
                        <th>Titel</th>
                        <th>Redigera</th>
                        <th>Intresserade</th>
                    </tr>
                </thead>
                <tbody>
                    {viewOffers ? (
                        ownOffers.map(article => (
                            <tr className='listOfArticles'>
                                <td>{article.title}</td>
                                <td>&#9998;</td>
                                <td>
                                    <input
                                        readOnly
                                        value={articleInterest
                                        .filter(interest => interest.article_id === article.id)
                                        .map(interest => interest.end_user.email)
                                        .join('; ')}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        ownNeeds.map(article => (
                            <tr className='listOfArticles'>
                                <td>{article.title}</td>
                                <td>&#9998;</td>
                                <td>
                                    <input
                                        readOnly
                                        value={articleInterest
                                        .filter(interest => interest.article_id === article.id)
                                        .map(interest => interest.end_user.email)
                                        .join('; ')}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyArticles;
