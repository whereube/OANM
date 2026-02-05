import { useRef, useState, useEffect} from "react";
import { ReactInfiniteCanvas, ReactInfiniteCanvasHandle } from "react-infinite-canvas";
import { useParams, Link } from "react-router-dom";

import { COMPONENT_POSITIONS } from "./helpers/constants.js";
import ReactDOM from "react-dom"; 
import './Canvas.css'
import HandleOffers from '../offers/HandleOffers.js'
import HandleNeeds from '../needs/HandleNeeds.js';
import HandleArticles from '../article/handleArticles.js';
import { useAuth } from '../auth/AuthProvider.js';
import Modal from '../article/viewArticles/Modal.js';



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
    const [allArticleInterests, setAllArticleInterests] = useState([]);
    const [articleInterestCounter, setArticleInterestCounter] = useState({})
    const [ownArticleInterest, setOwnArticleInterest] = useState([])
    const [modalisOpen, setModalIsOpen] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);
    const { user } = useAuth();
    const { getOffers, navigateToOfferArticle} = HandleOffers();
    const { getNeeds } = HandleNeeds();
    const { meetingId } = useParams();
    const { getArticleInterests, getArticleCategories, addArticleInterests, removeArticleInterest } = HandleArticles();


    useEffect(() => {
        getArticleInterests(setAllArticleInterests)
    }, []);

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
        const intervalId = setInterval(fetchOffers, 8000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const listOfArticleInterests = {}
        const objectOfOwnArticleInterests = {}

        for (const index in allArticleInterests) {
            listOfArticleInterests[allArticleInterests[index].article_id] = {
                'count': 0
            }
        }

        const keyCount = allArticleInterests.reduce((count, key) => {
            const articleId = key.article_id;
            // If the key already exists, increment the count, otherwise initialize it with count = 1 and id
            if (!count[articleId]) {
                count[articleId] = { count: 1, id: articleId };
            } else {
                count[articleId].count += 1;
            }
            return count;
        }, {});

        Object.keys(listOfArticleInterests).forEach(key => {
        if (keyCount[key] !== undefined) {
            listOfArticleInterests[key].count = keyCount[key].count;
        }
        });


        if(user !== null){
            let logedInUser = ''
            if(user.hasOwnProperty('userId')){
                logedInUser = user.userId
            } else {
                logedInUser = user.id
            }
            allArticleInterests.forEach(articleInterest => {
                if(articleInterest.user_id === logedInUser){
                    objectOfOwnArticleInterests[articleInterest.article_id] = {
                        'articleInterestId': articleInterest.id 
                    }
                }
            });
        }       

        setOwnArticleInterest(objectOfOwnArticleInterests)
        setArticleInterestCounter(listOfArticleInterests)
    }, [allArticleInterests]);

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

    const handleAccept = () => {
        markAsInterested(currentArticleId);
        setModalIsOpen(false);
    };

    const handleDecline = () => {
        setCurrentArticleId(null);
        setModalIsOpen(false);
    };

    const markAsInterested = async (articleId) => {
        if (user !== null) {
            let logedInUser = ''
            if(user.hasOwnProperty('userId')){
                logedInUser = user.userId
            } else {
                logedInUser = user.id
            }

            const data = {
                'articleId': articleId,
                'userId': logedInUser
            }
            await addArticleInterests(data);
            getArticleInterests(setAllArticleInterests)
        }
    }

    const filterOffers = (categoryIds, categoryId, level) => (offer) => {

        const nbrOfCategoryLevels = countNbrOfCategoryLevels(offer)
        const isIn = allArticleCategories.some(articleCategory => articleCategory.article_id === offer.id && categoryIds.includes(articleCategory.category_id))
        if(isIn === false){
            return false
        } else {
            return true
        }
    }  

    const removeMarkAsInterested = async (interestId) => {

        if (user !== null) {
            let logedInUser = ''
            if(user.hasOwnProperty('userId')){
                logedInUser = user.userId
            } else {
                logedInUser = user.id
            }

            const data = {
                'interestId': interestId,
                'userId': logedInUser
            }

            await removeArticleInterest(data)
            getArticleInterests(setAllArticleInterests)
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

    const handleInterestClick = (article_id) => {
        setModalIsOpen(true);
        setCurrentArticleId(article_id);
    };

    const getCategoryAndChildrenIds = (parentId) => [
        parentId,
        ...meetingCategories
            .filter(mc => mc.category.parent_id === parentId)
            .map(mc => mc.category.id)
    ];

    const spacing = 1000;

  return (
    <>
      <div className='canvasDiv'>
        <ReactInfiniteCanvas
          ref={canvasRef}
          onCanvasMount={(mountFunc) => {
            mountFunc.fitContentToView({ scale: 0.25 });
          }}
          customComponents={[
            {
              component: (
                <button
                  onClick={() => {
                    canvasRef.current?.fitContentToView({ scale: 0.25 });
                  }}
                >
                  Centrera
                </button>
              ),
              position: COMPONENT_POSITIONS.TOP_LEFT,
              offset: { x: 20, y: 20 },
            },
            {
              component: (
                <Link className="link" to={'/article/add/' + meetingId}>
                    <div className='addArticle'>
                        <p className="linkText">+</p>
                    </div>
                </Link>
              ),
              position: COMPONENT_POSITIONS.BOTTOM_LEFT,
              offset: { x: 20, y: 20 },
            },
            {
              component: (
                <div className="labels">
                    <div className="labelPart">
                        <div className="offerLabel"></div>
                        <p className="labelText">Erbjudande</p>
                    </div>
                    <div className="labelPart">
                        <div className="needLabel"></div>
                        <p className="labelText">Behov</p>
                    </div>
                </div>
              ),
              position: COMPONENT_POSITIONS.TOP_RIGHT,
              offset: { x: 20, y: 20 },
            },
          ]}
        >
            {meetingCategories.filter(mc => mc.category.parent_id === null)
                .map((meetingCategory, index) => {
                    const categoryIds = getCategoryAndChildrenIds(
                    meetingCategory.category.id
                    );

                    return (
                        <div key={meetingCategory.category.id} style={{left: index * spacing, top: 0,}} className="categoryBlock">
                            <h4 className="cardTitle">{meetingCategory.category.category_name}</h4>
                            {allOffers.filter(filterOffers(categoryIds, meetingCategory.category.id, 1)).map(article =>
                                <div key={article.id}  className="offerNeedCard offerCard">
                                    <p><b>{article.title}</b></p>
                                    <div className="aboutArticle">
                                        <p>{article.description}</p>
                                        <p>Upplagt av: {article.end_user.user_name}</p>
                                        {ownArticleInterest.hasOwnProperty(article.id) ? (
                                            <button
                                                className={`button-small offerButton ${ownArticleInterest.hasOwnProperty(article.id) ? 'liked' : ''}`}
                                                onClick={() => removeMarkAsInterested(ownArticleInterest[article.id].articleInterestId)}
                                            >
                                                Intresserad {articleInterestCounter.hasOwnProperty(article.id) ? articleInterestCounter[article.id].count : 0} &#128100;
                                            </button>
                                        ) : (
                                            <button
                                                className={`button-small offerButton`}
                                                onClick={() => handleInterestClick(article.id)}
                                            >
                                                Intresserad {articleInterestCounter.hasOwnProperty(article.id) ? articleInterestCounter[article.id].count : 0} &#128100;
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            {allNeeds.filter(filterOffers(categoryIds, meetingCategory.category.id, 1)).map(article =>
                                <div key={article.id}  className="offerNeedCard needCard">
                                    <p><b>{article.title}</b></p>
                                    <div className="aboutArticle">
                                        <p>{article.description}</p>
                                        <p>Upplagt av: {article.end_user.user_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            )}
        </ReactInfiniteCanvas>
        <Modal
            content={<p>Markerar du dig som intresserad på en artikel delas dina mailadress med skaparen av artikeln, vill du detta?</p>}
            modalisOpen={modalisOpen}
            handleDecline={handleDecline}
            handleAccept={handleAccept}
            setModalIsOpen={setModalIsOpen}
        />
      </div>
    </>
  );
};

//ReactDOM.render(<InfiniteCanvas />, document.getElementById("root"));

export default InfiniteCanvas;