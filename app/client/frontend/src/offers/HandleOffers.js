import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './ShowOffers.css'


const HandleOffers = () => {


    const navigate = useNavigate()

    const getOffers = async (type, setAllOffers) => {

        const response = await fetch('http://localhost:443/offers/' + type);
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

    return {
        getOffers,
        navigateToArticle
    };

}

export default HandleOffers