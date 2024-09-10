import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CategoryFilter from './CategoryFilter.js';
import HandleOffers from '../../offers/HandleOffers.js'
import HandleNeeds from '../../needs/HandleNeeds.js';
import ArticleList from './ArticleList.js';
import './ShowArticles.css'


const ShowArticles = () => {

    const [allOffers, setAllOffers] = useState([]);
    const [allNeeds, setAllNeeds] = useState([]);
    const [allArticleCategories, setAllArticleCategories] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [filteredNeeds, setFilteredNeeds] = useState([]);
    const [filterByCategory, setFilterByCategory] = useState({});
    const [viewOffers, setViewOffers] = useState(true)


    const { getOffers, navigateToArticle, getArticleCategories} = HandleOffers();
    const { getNeeds } = HandleNeeds();



    useEffect(() => {
        getOffers('getAll', setAllOffers);
        getNeeds('getAll', setAllNeeds);
        getArticleCategories(setAllArticleCategories);
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
                        navigateToArticle={navigateToArticle}
                        viewOffers={viewOffers}
                    />
                ) : (
                    <ArticleList 
                        activeCategoryFilter={activeCategoryFilter}
                        setFilterByCategory={setFilterByCategory}
                        filteredArticles={filteredNeeds}
                        navigateToArticle={navigateToArticle}
                    />
                )}
            </div>
        </div>
    )
}

export default ShowArticles