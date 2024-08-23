import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CategoryFilter from './CategoryFilter';
import HandleOffers from './HandleOffers.js'
import './ShowOffers.css'


const ShowOffers = () => {

    const [allOffers, setAllOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([])
    const [filterByCategory, setFilterByCategory] = useState('')
    const { getOffers, navigateToArticle, activeCategoryFilter, filterOffers } = HandleOffers();

    useEffect(() => {
        getOffers('getAll', setAllOffers);
    }, []);

    useEffect(() => {
        setFilteredOffers(allOffers)
    }, [allOffers]);

    useEffect(() => {
        let filtered = []
        if(filterByCategory !== ''){
            filtered = allOffers.filter(filterOffers)
        } else {
            filtered = allOffers
        }
        setFilteredOffers(filtered)
    }, [filterByCategory]);

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