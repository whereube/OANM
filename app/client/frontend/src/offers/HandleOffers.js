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


    const getArticleCategories = async (setAllArticleCategories) => {

        const response = await fetch(`${API_URL}/articleCategory/getAll`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllArticleCategories(result)
    }

    const navigateToArticle = (offerId) =>{
        navigate(`/showArticle/offer/${offerId}`);
    }

    return {
        getOffers,
        navigateToArticle,
        getArticleCategories
    };

}

export default HandleOffers