import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './ShowOffers.css'

const ShowOffers = () => {

    const [allOffers, setAllOffers] = useState([]);


    useEffect(() => {
        getOffers();
    }, []);

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

    return (
        <>
            <h1>Tillgängliga erbjudanden</h1>
            <div className='allOffersDiv'>
                {allOffers.map(offer => (
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
                        <button className='button-small offerButton'>Läs mer</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ShowOffers