import React, { useState, useEffect } from 'react';
import './Whiteboard.css'

const ListWhiteboardArticles = (props) => {

    useEffect(() => {
        const update = () => {
            console.log(props.meetingCategories)
            for (const meetingCategory of props.meetingCategories) {
                if (meetingCategory.category.parent_id === null){
                    const categoryCount = props.allArticles.filter(props.filterOffers(meetingCategory.category.id, 1)).length;
                    props.changeCategoryCounter(meetingCategory.category.id, categoryCount);
                } else if (meetingCategory.category.parent_id !== null){
                    const categoryCount = props.allArticles.filter(props.filterOffers(meetingCategory.category.id, 2)).length;
                    props.changeCategoryCounter(meetingCategory.category.id, categoryCount);
                }
            }
        }

        update();

    }, [props.meetingCategories, props.allArticles]);

    return (
        <>
            <div className='allWhiteboardArticles'>
                {props.meetingCategories.map(meetingCategory => (
                    <div className='categoryDiv' key={meetingCategory.category.id}>
                        {meetingCategory.category.parent_id === null && (
                            <>
                                <div className='categoryCollapseButton'>
                                    <h2>{meetingCategory.category.category_name}</h2>
                                    <p>{props.categoryCounter[meetingCategory.category.id]}</p>
                                </div>
                                {props.allArticles.filter(props.filterOffers(meetingCategory.category.id, 1)).map(article =>
                                    <div key={article.id} className='offerDiv'> 
                                        <p className="postedBy">Upplagt av: {article.end_user.user_name}</p>
                                        <p>{article.title}</p>
                                        <p>Beskrivning: {article.description}</p>
                                    </div>
                                )}
                                {props.meetingCategories.map(subMeetingCategory => (
                                    <div className='subCategoryDiv' key={subMeetingCategory.category.id}>
                                        {subMeetingCategory.category.parent_id === meetingCategory.category.id && (
                                            <>
                                                <div className='categoryCollapseButton'>
                                                    <h3>{subMeetingCategory.category.category_name}</h3>
                                                    <p>{props.categoryCounter[subMeetingCategory.category.id]}</p>
                                                </div>
                                                {props.allArticles.filter(props.filterOffers(subMeetingCategory.category.id, 2)).map(article =>
                                                    <div key={article.id} className='offerDiv'> 
                                                        <p className="postedBy">Upplagt av: {article.end_user.user_name}</p>
                                                        <p>{article.title}</p>
                                                        <p>Beskrivning: {article.description}</p>
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

export default ListWhiteboardArticles