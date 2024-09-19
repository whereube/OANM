import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CategoryFilter from './CategoryFilter.js';
import HandleOffers from '../../offers/HandleOffers.js'
import HandleNeeds from '../../needs/HandleNeeds.js';
import HandleArticles from '../handleArticles.js';
import ArticleList from './ArticleList.js';
import { useAuth } from '../../auth/AuthProvider.js';
import './ShowArticles.css'


const ShowArticles = () => {

    const [allOffers, setAllOffers] = useState([]);
    const [allNeeds, setAllNeeds] = useState([]);
    const [allArticleCategories, setAllArticleCategories] = useState([]);
    const [allArticleInterests, setAllArticleInterests] = useState([]);
    const [articleInterestCounter, setArticleInterestCounter] = useState({})
    const [ownArticleInterest, setOwnArticleInterest] = useState([])
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [filteredNeeds, setFilteredNeeds] = useState([]);
    const [filterByCategory, setFilterByCategory] = useState({});
    const [viewOffers, setViewOffers] = useState(true)
    const { user } = useAuth();



    const { getOffers, navigateToOfferArticle} = HandleOffers();
    const { getNeeds, navigateToNeedArticle } = HandleNeeds();
    const { getArticleInterests, getArticleCategories, addArticleInterests, removeArticleInterest } = HandleArticles();


    useEffect(() => {
        getOffers('getAll', setAllOffers);
        getNeeds('getAll', setAllNeeds);
        getArticleCategories(setAllArticleCategories);
        getArticleInterests(setAllArticleInterests)
    }, []);

    useEffect(() => {
        setFilteredOffers(allOffers)
    }, [allOffers]);

    useEffect(() => {
        setFilteredNeeds(allNeeds)
    }, [allNeeds]);


    useEffect(() => {
        let filtered = []

        if(viewOffers === true ) {
            if (Object.keys(filterByCategory).length > 0) {
                filtered = allOffers.filter(filterArticles)
            } else {
                filtered = allOffers
            }
            setFilteredOffers(filtered)
        } else {
            if (Object.keys(filterByCategory).length > 0) {
                filtered = allNeeds.filter(filterArticles)
            } else {
                filtered = allNeeds
            }
            setFilteredNeeds(filtered)
        }
    }, [filterByCategory, viewOffers]);


    useEffect(() => {
        const listOfArticleInterests = {}
        const objectOfOwnArticleInterests = {}

        for (const index in allArticleInterests) {
            listOfArticleInterests[allArticleInterests[index].article_id] = {
                'count': 0
            }
        }

        const keyCount = allArticleInterests.reduce((count, key) => {
            const articleId = key.article_id;
            // If the key already exists, increment the count, otherwise initialize it with count = 1 and id
            if (!count[articleId]) {
                count[articleId] = { count: 1, id: articleId };
            } else {
                count[articleId].count += 1;
            }
            return count;
        }, {});

        Object.keys(listOfArticleInterests).forEach(key => {
        if (keyCount[key] !== undefined) {
            listOfArticleInterests[key].count = keyCount[key].count;
        }
        });


        if(user !== null){
            let logedInUser = ''
            if(user.hasOwnProperty('userId')){
                logedInUser = user.userId
            } else {
                logedInUser = user.id
            }
            allArticleInterests.forEach(articleInterest => {
                if(articleInterest.user_id === logedInUser){
                    objectOfOwnArticleInterests[articleInterest.article_id] = {
                        'articleInterestId': articleInterest.id 
                    }
                }
            });
        }       

        setOwnArticleInterest(objectOfOwnArticleInterests)
        setArticleInterestCounter(listOfArticleInterests)
    }, [allArticleInterests]);

    const activeCategoryFilter = (setFilterByCategory, id, levelIndex) => {
        setFilterByCategory(prevState => {
            // Create a copy of the previous state
            const newState = { ...prevState };

            // Iterate over each key in the state
            Object.keys(newState).forEach(key => {
                const level = parseInt(key.split('_')[1], 10); // Extract the level number from the key

                // If the level is higher than the current levelIndex, delete the key
                if (level > levelIndex) {
                    delete newState[key];
                }
            });

            // Update the selected category for the current levelIndex

            newState[`level_${levelIndex}`] = id;

            return newState;
        });
    }

    const filterArticles = (article) => {
        for (let level in filterByCategory) {
            const levelIndex = parseInt(level.split('_')[1], 10) + 1;
            const categoryKey = `category_${levelIndex}`;


            if (filterByCategory[level] !== `all_${(levelIndex-1)}`){

                const isIn = allArticleCategories.some(obj => obj.article_id === article.id && obj.category_id === filterByCategory[level])
                if(isIn === false){
                    return false
                }
            }
        }
        return true;
    }  

    const toggleOffersOrNeeds = (displayOffers) => {
        setViewOffers(displayOffers)
    }


    const markAsInterested = async (articleId) => {
        if (user !== null) {
            let logedInUser = ''
            if(user.hasOwnProperty('userId')){
                logedInUser = user.userId
            } else {
                logedInUser = user.id
            }

            const data = {
                'articleId': articleId,
                'userId': logedInUser
            }
            await addArticleInterests(data);
            getArticleInterests(setAllArticleInterests)
        }
    }


    const removeMarkAsInterested = async (interestId) => {

        if (user !== null) {
            let logedInUser = ''
            if(user.hasOwnProperty('userId')){
                logedInUser = user.userId
            } else {
                logedInUser = user.id
            }

            const data = {
                'interestId': interestId,
                'userId': logedInUser
            }

            await removeArticleInterest(data)
            getArticleInterests(setAllArticleInterests)
        }
    }

    return (
        <div className='showAllArticles'>
            <div className='showOffersOrNeeds'>
                <div className='buttonsDiv'>
                    <p className={`OfferOrNeedButton ${viewOffers && 'active'} `} onClick={() => toggleOffersOrNeeds(true)}>Erbjudanden</p>
                    <p className={`OfferOrNeedButton ${viewOffers === false && 'active'} `} onClick={() => toggleOffersOrNeeds(false)}>Behov</p>
                </div>
            </div>
            <div className={`articleList`}>
                {viewOffers ? (
                    <ArticleList 
                        activeCategoryFilter={activeCategoryFilter}
                        setFilterByCategory={setFilterByCategory}
                        filteredArticles={filteredOffers}
                        navigateToArticle={navigateToOfferArticle}
                        viewOffers={viewOffers}
                        markAsInterested={markAsInterested}
                        removeMarkAsInterested={removeMarkAsInterested}
                        articleInterestCounter={articleInterestCounter}
                        ownArticleInterest={ownArticleInterest}
                    />
                ) : (
                    <ArticleList 
                        activeCategoryFilter={activeCategoryFilter}
                        setFilterByCategory={setFilterByCategory}
                        filteredArticles={filteredNeeds}
                        navigateToArticle={navigateToNeedArticle}
                        markAsInterested={markAsInterested}
                        removeMarkAsInterested={removeMarkAsInterested}
                        articleInterestCounter={articleInterestCounter}
                        ownArticleInterest={ownArticleInterest}
                    />
                )}
            </div>
        </div>
    )
}

export default ShowArticles