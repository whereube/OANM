import { useRef, useState, useEffect} from "react";
import { ReactInfiniteCanvas, ReactInfiniteCanvasHandle } from "react-infinite-canvas";
import { useParams } from "react-router-dom";

import { COMPONENT_POSITIONS } from "./helpers/constants.js";
import ReactDOM from "react-dom"; 
import './Canvas.css'
import HandleOffers from '../offers/HandleOffers.js'
import HandleNeeds from '../needs/HandleNeeds.js';
import HandleArticles from '../article/handleArticles.js';


const InfiniteCanvas = () => {

  const canvasRef = useRef(null);
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


  return (
    <>
      <div className='canvasDiv'>
        <ReactInfiniteCanvas
          ref={canvasRef}
          onCanvasMount={(mountFunc) => {
            mountFunc.fitContentToView({ scale: 1 });
          }}
          customComponents={[
            {
              component: (
                <button
                  onClick={() => {
                    canvasRef.current?.fitContentToView({ scale: 1 });
                  }}
                >
                  Centrera
                </button>
              ),
              position: COMPONENT_POSITIONS.TOP_LEFT,
              offset: { x: 120, y: 10 },
            },
          ]}
        >
            {meetingCategories.map((meetingCategory, index) => (
                meetingCategory.category.parent_id === null && (
                    <div key={meetingCategory.category.id} style={{left: index * 700, top: 0,}} className="categoryBlock">
                        {allOffers.filter(filterOffers(meetingCategory.category.id, 1)).map(article =>
                            <div key={article.id}  className="offerNeedCard">
                                <p>{article.title}</p>
                                <div>
                                    <p>Some description</p>
                                    <p>Upplagt av: Ingen</p>
                                </div>
                            </div>
                        )}
                    </div>
                )
            ))}
        </ReactInfiniteCanvas>
      </div>
    </>
  );
};

//ReactDOM.render(<InfiniteCanvas />, document.getElementById("root"));

export default InfiniteCanvas;