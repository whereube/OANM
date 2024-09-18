import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const HandleNeeds = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const navigate = useNavigate()

    const getNeeds = async (type, setAllOffers) => {

        const response = await fetch(`${API_URL}/needs/` + type);
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

    const navigateToNeedArticle = (offerId) =>{
        navigate(`/showArticle/need/${offerId}`);
    }

    return {
        getNeeds,
        navigateToNeedArticle,
        getArticleCategories
    };

}

export default HandleNeeds