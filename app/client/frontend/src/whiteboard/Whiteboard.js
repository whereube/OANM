import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import HandleOffers from '../offers/HandleOffers.js'
import HandleNeeds from '../needs/HandleNeeds.js';
import HandleArticles from '../article/handleArticles.js';
import ListWhiteboardArticles from './ListWhiteboardArticles.js';
import './Whiteboard.css'

const Whiteboard = (props) => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [allOffers, setAllOffers] = useState([]);
    const [allNeeds, setAllNeeds] = useState([]);
    const [meetingCategories, setMeetingCategories] = useState([])
    const [allArticleCategories, setAllArticleCategories] = useState([]);
    const [viewOffers, setViewOffers] = useState(true)
    const [categoryCounter, setCategoryCounter] = useState({})
    const [categoryCollapse, setCategoryCollapse] = useState({})
    const { getOffers, navigateToOfferArticle} = HandleOffers();
    const { getArticleCategories} = HandleArticles();
    const { getNeeds } = HandleNeeds();
    const { meetingId } = useParams();



    useEffect(() => {
        getMeetingCategories();
    }, []);

    useEffect(() => {
        const newList = allArticleCategories.filter(filterArticleCategories);
        if (newList.length !== allArticleCategories.length) {
            setAllArticleCategories(newList)
        }
    }, [allArticleCategories]);

    useEffect(() => {
        const listOfMeetingCategories = {}
        for (const index in meetingCategories) {
            listOfMeetingCategories[meetingCategories[index].category.id] = 0;
        }
        setCategoryCounter(listOfMeetingCategories)
    }, [meetingCategories]);

    useEffect(() => {
        const listOfMeetingCategories = {}
        for (const index in meetingCategories) {
            listOfMeetingCategories[meetingCategories[index].category.id] = true;
        }
        setCategoryCollapse(listOfMeetingCategories)
    }, [meetingCategories]);


    useEffect(() => {

        const fetchOffers = () => {
            getOffers('byMeetingId/' + meetingId, setAllOffers);
            getNeeds('byMeetingId/' + meetingId, setAllNeeds);
            getArticleCategories(setAllArticleCategories);
        };

        fetchOffers();

        // Set up interval
        const intervalId = setInterval(fetchOffers, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    const getMeetingCategories = async () => {
        const response = await fetch(`${API_URL}/meetingCategory/byMeetingId/` + meetingId);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setMeetingCategories(result)
    }

    const filterOffers = (categoryId, level) => (offer) => {

        const nbrOfCategoryLevels = countNbrOfCategoryLevels(offer)
        const isIn = allArticleCategories.some(articleCategory => articleCategory.article_id === offer.id && articleCategory.category_id === categoryId && level === nbrOfCategoryLevels)
        if(isIn === false){
            return false
        } else {
            return true
        }
    }  


    const filterOffersForCounter = (categoryId, level) => (offer) => {

        const nbrOfCategoryLevels = countNbrOfCategoryLevels(offer)
        const isIn = allArticleCategories.some(articleCategory => articleCategory.article_id === offer.id && articleCategory.category_id === categoryId)
        if(isIn === false){
            return false
        } else {
            return true
        }
    }  


    const filterArticleCategories = (articleCategory) => {
        return meetingCategories.some(meetingCategory => {
            return articleCategory.category_id === meetingCategory.category_id;
        });
    }

    const countNbrOfCategoryLevels = (offer) => {
        return allArticleCategories.reduce((count, articleCategory) => {
            return articleCategory.article_id === offer.id ? count + 1 : count;
        }, 0);
    }

    const toggleOffersOrNeeds = (displayOffers) => {
        setViewOffers(displayOffers)
    }

    const changeCategoryCounter = (categoryId, amount) => {

        setCategoryCounter((prevCategoryCounter) => ({
            ...prevCategoryCounter,   
            [categoryId]: amount
        }));
    };

    const changeCollapseState = (categoryId) => {
        setCategoryCollapse((prevCategoryCollapse) => ({
            ...prevCategoryCollapse,   
            [categoryId]: !prevCategoryCollapse[categoryId]
        }));
    }

    return (
        <div className='whiteboardDiv'>
            <div className='showOffersOrNeeds'>
                <div className='buttonsDiv'>
                    <p className={`OfferOrNeedButton ${viewOffers && 'active'} `} onClick={() => toggleOffersOrNeeds(true)}>Erbjudanden</p>
                    <p className={`OfferOrNeedButton ${viewOffers === false && 'active'} `} onClick={() => toggleOffersOrNeeds(false)}>Behov</p>
                </div>
            </div>
            {viewOffers ? (
                <ListWhiteboardArticles 
                    meetingCategories={meetingCategories}
                    allArticles={allOffers}
                    filterOffers={filterOffers}
                    filterOffersForCounter={filterOffersForCounter}
                    categoryCounter={categoryCounter}
                    changeCategoryCounter={changeCategoryCounter}
                    categoryCollapse={categoryCollapse}
                    changeCollapseState={changeCollapseState}
                />
            ) : (
                <ListWhiteboardArticles 
                    meetingCategories={meetingCategories}
                    allArticles={allNeeds}
                    filterOffers={filterOffers}
                    filterOffersForCounter={filterOffersForCounter}
                    categoryCounter={categoryCounter}
                    changeCategoryCounter={changeCategoryCounter}
                    categoryCollapse={categoryCollapse}
                    changeCollapseState={changeCollapseState}
                />
            )}
        </div>
    )
}

export default Whiteboard