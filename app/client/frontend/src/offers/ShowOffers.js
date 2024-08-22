import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CategoryFilter from './CategoryFilter';
import './ShowOffers.css'


const ShowOffers = () => {

    const [allOffers, setAllOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([])
    const [filterByCategory, setFilterByCategory] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        getOffers();
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

    const getOffers = async () => {
        const response = await fetch('http://localhost:443/offers/getAll');
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllOffers(result)
    }

    const navigateToArticle = (offerId) =>{
        navigate(`/showArticle/offer/${offerId}`);
    }

    const activeCategoryFilter = (id) => {
        setFilterByCategory(id)
    }


    const filterOffers = (offer) => {
        return offer.category_1 === filterByCategory
    }  

    return (
        <>
            <h1>Tillgängliga erbjudanden</h1>
            <CategoryFilter activeCategoryFilter={activeCategoryFilter}/>
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