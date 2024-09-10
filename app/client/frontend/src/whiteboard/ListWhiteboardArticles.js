import React, { useState, useEffect } from 'react';
import './Whiteboard.css'

const ListWhiteboardArticles = (props) => {
    return (
        <>
            <div className='allWhiteboardArticles'>
                {props.meetingCategories.map(meetingCategory => (
                    <div className='categoryDiv' key={meetingCategory.category.id}>
                        {meetingCategory.category.parent_id === null && (
                            <>
                                <h2>{meetingCategory.category.category_name}</h2>
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
                                                <h3>{subMeetingCategory.category.category_name}</h3>
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