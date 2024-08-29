import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CategoryFilter from './CategoryFilter';
import HandleOffers from './HandleOffers.js'
import './ShowOffers.css'


const ShowOffers = () => {

    const [allOffers, setAllOffers] = useState([]);
    const [allArticleCategories, setAllArticleCategories] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([])
    const [filterByCategory, setFilterByCategory] = useState({})
    const { getOffers, navigateToArticle, getArticleCategories} = HandleOffers();

    useEffect(() => {
        getOffers('getAll', setAllOffers);
        getArticleCategories(setAllArticleCategories);
    }, []);

    useEffect(() => {
        setFilteredOffers(allOffers)
    }, [allOffers]);

    useEffect(() => {

        let filtered = []
        if (Object.keys(filterByCategory).length > 0) {
            filtered = allOffers.filter(filterOffers)
        } else {
            filtered = allOffers
        }
        setFilteredOffers(filtered)
    }, [filterByCategory]);

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

    const filterOffers = (offer) => {
        for (let level in filterByCategory) {
            const levelIndex = parseInt(level.split('_')[1], 10) + 1;
            const categoryKey = `category_${levelIndex}`;


            if (filterByCategory[level] !== `all_${(levelIndex-1)}`){

                const isIn = allArticleCategories.some(obj => obj.article_id === offer.id && obj.category_id === filterByCategory[level])
                if(isIn === false){
                    return false
                }
            }
        }
        return true;
    }  

    return (
        <>
            <h1>Tillgängliga erbjudanden</h1>
            <CategoryFilter activeCategoryFilter={activeCategoryFilter} setFilterByCategory={setFilterByCategory}/>
            <div className='allOffersDiv'>
                {filteredOffers.map(offer => (
                    <div key={offer.id} className='offerBox'>
                        <p className='offerTitle'>{offer.title}</p>
                        {offer.available_digitaly ? (
                            <p className='location'>Tillgänglig digitalt</p>
                        ) : (
                            <p className='location'>Plats: {offer.location}</p>
                        )
                        }
                        <p className='offerDesc'>{offer.description}</p>
                        <button className='button-small offerButton'>Markera som intresserad</button>
                        <button className='button-small offerButton' onClick={() => navigateToArticle(offer.id)}>Läs mer</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ShowOffers