import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const HandleOffers = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const navigate = useNavigate()

    const getOffers = async (type, setAllOffers) => {

        const response = await fetch(`${API_URL}/offers/` + type);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllOffers(result)
    }

    const getOffersForUser = async (setAllOffers, userId) => {

        const response = await fetch(`${API_URL}/offers/byUserId/` + userId);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllOffers(result)
    }

    const navigateToOfferArticle = (offerId) =>{
        navigate(`/showArticle/offer/${offerId}`);
    }

    return {
        getOffers,
        navigateToOfferArticle,
        getOffersForUser
    };

}

export default HandleOffers