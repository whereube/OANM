import React, { useState, useEffect } from 'react';


const HandleArticles = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;

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


    const getArticleInterests = async (setAllArticleInterests) => {

        const response = await fetch(`${API_URL}/articleInterest/getAll`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setAllArticleInterests(result)
    }


    const addArticleInterests = async (postData) => {

        try {
            const response = await fetch(`${API_URL}/articleInterest/add`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData), 
            });

            const data = await response.json();

            if (response.ok) {
                return data
            } else {
                
            }
        } catch (error) {
            console.error('Error adding interest:', error);
        }
    }


    const removeArticleInterest = async (postData) => {

        try {
            const response = await fetch(`${API_URL}/articleInterest/remove`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData), 
            });

            const data = await response.json();

            if (response.ok) {
                return data
            } else {
                return false
            }
        } catch (error) {
            console.error('Error removing interest:', error);
        }
    }

    return {
        getArticleCategories,
        getArticleInterests,
        addArticleInterests,
        removeArticleInterest
    };

}

export default HandleArticles