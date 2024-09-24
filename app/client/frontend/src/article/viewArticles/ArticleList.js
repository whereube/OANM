import CategoryFilter from './CategoryFilter';
import React, { useState } from 'react';
import Modal from './Modal';

const ArticleList = (props) => {

    const [modalisOpen, setModalIsOpen] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);

    const handleInterestClick = (article_id) => {
        setModalIsOpen(true);
        setCurrentArticleId(article_id);
    };

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
            ) : (
                <h1>Behov</h1>
            )}
            <CategoryFilter activeCategoryFilter={props.activeCategoryFilter} setFilterByCategory={props.setFilterByCategory} />

            <table className='articleTable'>
                <thead>
                    <tr>
                        <th>Titel</th>
                        <th>Beskrivning</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.filteredArticles.map((article) => (
                        <tr key={article.id}>
                            <td className='title-td'>{article.title}</td>
                            <td>{article.description.substr(0, 60)}{article.description.length > 60 ? '...' : ''}</td>
                            <td>
                                <div className='articleButtons'>
                                    <button
                                        className='button-small offerButton'
                                        onClick={() => props.navigateToArticle(article.id)}
                                    >
                                        Läs mer
                                    </button>
                                    {props.ownArticleInterest.hasOwnProperty(article.id) ? (
                                        <button
                                            className={`button-small offerButton ${props.ownArticleInterest.hasOwnProperty(article.id) ? 'liked' : ''}`}
                                            onClick={() => props.removeMarkAsInterested(props.ownArticleInterest[article.id].articleInterestId)}
                                        >
                                            Intresserad {props.articleInterestCounter.hasOwnProperty(article.id) ? props.articleInterestCounter[article.id].count : 0} &#128100;
                                        </button>
                                    ) : (
                                        <button
                                            className={`button-small offerButton`}
                                            onClick={() => handleInterestClick(article.id)}
                                        >
                                            Intresserad {props.articleInterestCounter.hasOwnProperty(article.id) ? props.articleInterestCounter[article.id].count : 0} &#128100;
                                        </button>
                                    )}
                                    
                                </div>
                                <Modal
                                    content={<p>Markerar du dig som intresserad på en artikel delas dina mailadress med skaparen av artikeln, vill du detta?</p>}
                                    modalisOpen={modalisOpen}
                                    handleDecline={handleDecline}
                                    handleAccept={handleAccept}
                                    setModalIsOpen={setModalIsOpen}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ArticleList;
