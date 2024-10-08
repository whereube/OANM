import React, { useState, useEffect } from 'react';
import './Whiteboard.css'

const ListWhiteboardArticles = (props) => {

    useEffect(() => {
        const update = () => {
            for (const meetingCategory of props.meetingCategories) {
                if (meetingCategory.category.parent_id === null){
                    const categoryCount = props.allArticles.filter(props.filterOffersForCounter(meetingCategory.category.id, 1)).length;
                    props.changeCategoryCounter(meetingCategory.category.id, categoryCount);
                } else if (meetingCategory.category.parent_id !== null){
                    const categoryCount = props.allArticles.filter(props.filterOffersForCounter(meetingCategory.category.id, 2)).length;
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
                    meetingCategory.category.parent_id === null && (
                        <div className='categoryDiv' key={meetingCategory.category.id}>
                            <>
                                <div className='categoryCollapseButton' onClick={() => props.changeCollapseState(meetingCategory.category.id)}>
                                    <h2 className='collapseText'>{meetingCategory.category.category_name}</h2>
                                    <p className='collapseCounter'>{props.categoryCounter[meetingCategory.category.id]}</p>
                                    {props.categoryCollapse[meetingCategory.category.id] ? (
                                        <p className='arrowIcon'>&#43;</p>
                                    ):(
                                        <p className='arrowIcon'>&#8722;</p>
                                    )}
                                </div>
                                <div className={`categoryCollapse ${props.categoryCollapse[meetingCategory.category.id] && 'collapsed'} `}>
                                    {props.allArticles.filter(props.filterOffers(meetingCategory.category.id, 1)).map(article =>
                                        <div key={article.id} className='offerDiv'> 
                                            <p className='articleTitle'>{article.title}</p>
                                            <div className='articleDescAndPoster'>
                                                <p className='articleDesc'>{article.description}</p>
                                                <p className="postedBy">Upplagt av: {article.end_user.user_name}</p>
                                            </div>
                                        </div>
                                    )}
                                    {props.meetingCategories.map(subMeetingCategory => (
                                        <div className='subCategoryDiv' key={subMeetingCategory.category.id}>
                                            {subMeetingCategory.category.parent_id === meetingCategory.category.id && (
                                                <>
                                                    <div className='categoryCollapseButton sub'  onClick={() => props.changeCollapseState(subMeetingCategory.category.id)}>
                                                        <h3>{subMeetingCategory.category.category_name}</h3>
                                                        <p>{props.categoryCounter[subMeetingCategory.category.id]}</p>
                                                        {props.categoryCollapse[subMeetingCategory.category.id] ? (
                                                            <p className='arrowIcon sub'>&#43;</p>
                                                        ):(
                                                            <p className='arrowIcon sub'>&#8722;</p>
                                                        )}
                                                    </div>
                                                    <div className={`categoryCollapse ${props.categoryCollapse[subMeetingCategory.category.id] && 'collapsed'} `}>
                                                        {props.allArticles.filter(props.filterOffers(subMeetingCategory.category.id, 2)).map(article =>
                                                            <div key={article.id} className='offerDiv offerDivSub'> 
                                                                <h4 className='articleTitle'>{article.title}</h4>
                                                                <div className='articleDescAndPoster'>
                                                                    <p className='articleDesc'>{article.description}</p>
                                                                    <p className="postedBy">Upplagt av: {article.end_user.user_name}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        </div>
                    )
                ))}
            </div>
        </>
    )
}

export default ListWhiteboardArticles