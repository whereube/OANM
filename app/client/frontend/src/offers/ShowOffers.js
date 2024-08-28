import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CategoryFilter from './CategoryFilter';
import HandleOffers from './HandleOffers.js'
import './ShowOffers.css'


const ShowOffers = () => {

    const [allOffers, setAllOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([])
    const [filterByCategory, setFilterByCategory] = useState({})
    const { getOffers, navigateToArticle} = HandleOffers();

    useEffect(() => {
        getOffers('getAll', setAllOffers);
    }, []);

    useEffect(() => {
        setFilteredOffers(allOffers)
    }, [allOffers]);

    useEffect(() => {

        console.log(filterByCategory)
        let filtered = []
        if (Object.keys(filterByCategory).length > 0) {
            filtered = allOffers.filter(filterOffers)
        } else {
            filtered = allOffers
        }
        setFilteredOffers(filtered)
    }, [filterByCategory]);

    const activeCategoryFilter = (setFilterByCategory,id, levelIndex) => {
        setFilterByCategory(prevState => ({
            ...prevState,
            [`level_${levelIndex}`]: id.includes('all_') ? `all_${levelIndex}` : id
        }));
    }

    const filterOffers = (offer) => {

        for (let level in filterByCategory) {
            const levelIndex = parseInt(level.split('_')[1], 10) + 1;
            const categoryKey = `category_${levelIndex}`;

            console.log("index: " + levelIndex)
            console.log("key: " + categoryKey)
            console.log("level: " + level)
            
            // Check if the offer matches the category in the filter
            if (filterByCategory[level] !== `all_${(levelIndex-1)}` && offer[categoryKey] !== filterByCategory[level]) {
                return false; // If it doesn't match, exclude this offer
            }
        }
        return true; // If all levels match, include this offer
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