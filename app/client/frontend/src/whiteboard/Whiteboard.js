import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import HandleOffers from '../offers/HandleOffers.js'
import './Whiteboard.css'


const Whiteboard = (props) => {


    const categories = [
        {'id': 'aeb778ee-939d-44e4-8f57-8810c3347dae', 'name': 'Lokaler'},
        {'id': '6a319924-f2d3-4813-8103-7ad7fc7676ce', 'name': 'Evenemang'},
        {'id': '2b6af113-55d2-4bcc-9066-d17196ffd745', 'name': 'Övrigt'}
    ];

    const [allOffers, setAllOffers] = useState([]);
    const { getOffers, navigateToArticle} = HandleOffers();
    const { meetingId } = useParams();


    useEffect(() => {
        getOffers('byMeetingId/' + meetingId, setAllOffers);
        //byMeetingId/811dcd95-a4a2-4bd8-acdf-9ef4ceaf55cb
    }, []);

    useEffect(() => {
        console.log(allOffers)
    }, [allOffers]);


  useEffect(() => {

    const fetchOffers = () => {
      getOffers('byMeetingId/' + meetingId, setAllOffers);
    };

    fetchOffers();

    // Set up interval
    const intervalId = setInterval(fetchOffers, 5000); // 500 milliseconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);


    return (
        <>
            <div className='whiteboardDiv'>
                {categories.map(category => (
                    <div className='categoryDiv' key={category.id}>
                        <h2>{category.name}</h2>
                        {allOffers.map(offer => (
                            offer.category_1 === category.id && (
                                <div className='offerDiv'> 
                                    <p className="postedBy" key={offer.end_user.id}>Upplagt av: {offer.end_user.user_name}</p>
                                    <p key={offer.id}>{offer.title}</p>
                                    <p key={offer.description}>Beskrivning: {offer.description}</p>
                                </div>
                            )
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Whiteboard