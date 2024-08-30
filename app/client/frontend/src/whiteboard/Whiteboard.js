import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import HandleOffers from '../offers/HandleOffers.js'
import './Whiteboard.css'

const Whiteboard = (props) => {

    const [allOffers, setAllOffers] = useState([]);
    const [meetingCategories, setMeetingCategories] = useState([])
    const [allArticleCategories, setAllArticleCategories] = useState([]);
    const { getOffers, navigateToArticle, getArticleCategories} = HandleOffers();
    const { meetingId } = useParams();


    useEffect(() => {
        getMeetingCategories();
        //byMeetingId/811dcd95-a4a2-4bd8-acdf-9ef4ceaf55cb
    }, []);


    useEffect(() => {
        const newList = allArticleCategories.filter(filterArticleCategories);
        if (newList.length !== allArticleCategories.length) {
            setAllArticleCategories(newList)
        }
    }, [allArticleCategories]);

    useEffect(() => {

        const fetchOffers = () => {
            getOffers('byMeetingId/' + meetingId, setAllOffers);
            getArticleCategories(setAllArticleCategories);
        };

        fetchOffers();

        // Set up interval
        const intervalId = setInterval(fetchOffers, 10000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    const getMeetingCategories = async () => {
        const response = await fetch('http://localhost:443/meetingCategory/byMeetingId/811dcd95-a4a2-4bd8-acdf-9ef4ceaf55cb');
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

    const findArticleSubCategory = (categoryId, offer) => {
        const categoryHasSubCategory = meetingCategories.find(meetingCategory => {
            return meetingCategory.category.parent_id === categoryId
        })

        let notLowestCategory = false
        if(categoryHasSubCategory != undefined){
            notLowestCategory = allArticleCategories.some(articleCategory => articleCategory.article_id === offer.id && articleCategory.category_id !== categoryHasSubCategory.category_id)
        } 
        return notLowestCategory
    }   


    return (
        <>
            <div className='whiteboardDiv'>
                {meetingCategories.map(meetingCategory => (
                    <div className='categoryDiv' key={meetingCategory.category.id}>
                        {meetingCategory.category.parent_id === null && (
                            <>
                                <h2>{meetingCategory.category.category_name}</h2>
                                {allOffers.filter(filterOffers(meetingCategory.category.id, 1)).map(offer =>
                                    <div className='offerDiv'> 
                                        <p className="postedBy" key={offer.end_user.id}>Upplagt av: {offer.end_user.user_name}</p>
                                        <p key={offer.id}>{offer.title}</p>
                                        <p key={offer.description}>Beskrivning: {offer.description}</p>
                                    </div>
                                )}
                                {meetingCategories.map(subMeetingCategory => (
                                    <div className='subCategoryDiv' key={subMeetingCategory.category.id}>
                                        {subMeetingCategory.category.parent_id === meetingCategory.category.id && (
                                            <>
                                                <h3>{subMeetingCategory.category.category_name}</h3>
                                                {allOffers.filter(filterOffers(subMeetingCategory.category.id, 2)).map(offer =>
                                                    <div className='offerDiv'> 
                                                        <p className="postedBy" key={offer.end_user.id}>Upplagt av: {offer.end_user.user_name}</p>
                                                        <p key={offer.id}>{offer.title}</p>
                                                        <p key={offer.description}>Beskrivning: {offer.description}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Whiteboard