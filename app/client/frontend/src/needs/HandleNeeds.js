import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const HandleNeeds = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const navigate = useNavigate()

    const getNeeds = async (type, setAllOffers) => {

        const response = await fetch(`${API_URL}/needs/` + type);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllOffers(result)
    }

    const getNeedsForUser = async (setAllNeeds, userId) => {

        const response = await fetch(`${API_URL}/needs/byUserId/` + userId);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllNeeds(result)
    }

    const getUsersOwnNeeds = async (setOwnNeeds, userId) => {

        const response = await fetch(`${API_URL}/needs/usersOwnNeeds/` + userId);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setOwnNeeds(result)
    }


    const navigateToNeedArticle = (offerId) =>{
        navigate(`/showArticle/need/${offerId}`);
    }

    return {
        getNeeds,
        navigateToNeedArticle,
        getNeedsForUser,
        getUsersOwnNeeds
    };

}

export default HandleNeeds