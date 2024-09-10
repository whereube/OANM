import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


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


    const getArticleCategories = async (setAllArticleCategories) => {

        const response = await fetch('http://localhost:443/articleCategory/getAll');
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