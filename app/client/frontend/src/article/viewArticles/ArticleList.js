import CategoryFilter from './CategoryFilter';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const ArticleList = (props) => {

    const [modalisOpen, setModalIsOpen] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);

    const handleInterestClick = (article_id) => {
        setModalIsOpen(true)
        setCurrentArticleId(article_id);
    }

    const handleAccept = () => {
        props.markAsInterested(currentArticleId);
        setModalIsOpen(false);
    };

    const handleDecline = () => {
        setCurrentArticleId(null);
        setModalIsOpen(false); 
    };


    return (
        <>
            {props.viewOffers ? (
                <h1>Tillgängliga erbjudanden</h1>
            ):(
                <h1>Behov</h1>
            )}
            <CategoryFilter activeCategoryFilter={props.activeCategoryFilter} setFilterByCategory={props.setFilterByCategory}/>
            <div className='allOffersDiv'>
                {props.filteredArticles.map(article => (
                    <div key={article.id} className='offerBox'>
                        <div className='articleText'>
                            <p className='offerTitle'>{article.title}</p>
                            <p className='offerDesc'>{article.description.substr(0, 200)}{article.description.length > 200 ? '...' : ''}</p>
                        </div>
                        <div className='articleButtons'>
                            {props.ownArticleInterest.hasOwnProperty(article.id) ? (
                                <button className={`button-small offerButton ${props.ownArticleInterest.hasOwnProperty(article.id) ? 'liked': ''}`} onClick={() => props.removeMarkAsInterested(props.ownArticleInterest[article.id].articleInterestId)}>Intresserad {props.articleInterestCounter.hasOwnProperty(article.id) ? props.articleInterestCounter[article.id].count : 0} &#128100;</button>
                            ):(
                                <button className={`button-small offerButton`} onClick={() => handleInterestClick(article.id)}> Intresserad {props.articleInterestCounter.hasOwnProperty(article.id) ? props.articleInterestCounter[article.id].count : 0} &#128100;</button>
                            )}
                            <button className='button-small offerButton' onClick={() => props.navigateToArticle(article.id)}>Läs mer</button>
                        </div>
                        <Modal 
                            content={<p>Markerar du dig som intresserad på en artikel delas dina mailadress med skaparen av artikeln, vill du detta?</p>}
                            modalisOpen={modalisOpen}
                            handleDecline={handleDecline}
                            handleAccept={handleAccept}
                            setModalIsOpen={setModalIsOpen}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default ArticleList