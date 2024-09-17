import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Article.css'


const Article = () => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [article, setArticle] = useState({});
    let { id, offerOrNeed } = useParams();

    useEffect(() => {
        getArticle();
    }, []);


    const getArticle = async () => {

        let response = {} 

        if(offerOrNeed === 'offer'){
            response = await fetch(`${API_URL}/offers/byId/` + id);
        } else if(offerOrNeed === 'need') {
            response = await fetch(`${API_URL}/needs/byId/` + id);
        }
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setArticle(result)
    }

    return (
        <>
            <div className='articlePage'>
                <h1>{article.title}</h1>
                {article.available_digitaly ? (
                    <p>Tillgänglig digitalt</p>
                ) : (
                    <p>Plats: {article.location}</p>
                )
                }
                <p>{article.description}</p>
                {article.link != '' &&(
                    <a href={article.link} target='_blank'>Läs mer här</a>
                )}
            </div>
        </>
    )
}

export default Article