import { useRef, useState, useEffect} from "react";
import { ReactInfiniteCanvas, ReactInfiniteCanvasHandle } from "react-infinite-canvas";
import { useParams, Link } from "react-router-dom";

import { COMPONENT_POSITIONS, SCROLL_NODE_POSITIONS } from "./helpers/constants.js";
import ReactDOM from "react-dom"; 
import './Canvas.css'
import HandleOffers from '../offers/HandleOffers.js'
import HandleNeeds from '../needs/HandleNeeds.js';
import HandleArticles from '../article/handleArticles.js';
import { useAuth } from '../auth/AuthProvider.js';
import Modal from '../article/viewArticles/Modal.js';
import ListCanvasArticles from './ListCanvasArticles.js';




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
    const [autoSortActive, setAutoSortActive] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);
    const [categoryClusters, setCategoryClusters] = useState([])
    const [epsilonSlider, setEpsilonSlider] = useState(0.5)
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


    useEffect(() => {
        if(Object.keys(categoryClusters).length !== 0) {
            console.log(categoryClusters)
        }
    }, [categoryClusters]);

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
        const isIn = allArticleCategories.some(articleCategory => articleCategory.article_id === offer.id && articleCategory.category_id === categoryId && level === nbrOfCategoryLevels)
        if(isIn === false){
            return false
        } else {
            return true
        }
    }  


    const filterOffersIncSubcategory = (categoryId) => (offer) => {

        const nbrOfCategoryLevels = countNbrOfCategoryLevels(offer)
        const isIn = allArticleCategories.some(articleCategory => articleCategory.article_id === offer.id && articleCategory.category_id === categoryId)
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

    const computeSimilarity = async() => {
        const promises = meetingCategories.filter(mc => mc.category.parent_id === null).map(async(meetingCategory) => {
            const category_offers = allOffers.filter(filterOffersIncSubcategory(meetingCategory.category.id))
            const category_needs = allNeeds.filter(filterOffersIncSubcategory(meetingCategory.category.id))
            const category_articles = category_offers.concat(category_needs)
            const response = await fetch(`${API_URL}/offers/similarity`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({epsilon: epsilonSlider, category: meetingCategory.category.id, sentences: category_articles})
                /*JSON.stringify({sentences:[{"id": 1, "text": "Många bäckar små"}, {"id": 2, "text": "Grönska är bra för världen"} , {"id": 3, "text": "Jag vill skapa en delad verkstad"}, {"id": 1666, "text": "Jag behöver en delad verkstad"}]}), */
            });
            return response.json();
            
        })
        const results = await Promise.all(promises);
        setCategoryClusters(results)
        setAutoSortActive(true)
    }

    const resetSorting = async() => {
        setAutoSortActive(false)
    }

    const handleSliderChange = (e) => {
        setEpsilonSlider(Number(e.target.value));
    };



    const spacing = 1000;

  return (
    <>
      <div className='canvasDiv'>
        <ReactInfiniteCanvas
          ref={canvasRef}
          onCanvasMount={(mountFunc) => {
            mountFunc.fitContentToView({ scale: 0.25 });
          }}
        scrollBarConfig={{
            renderScrollBar: true,
            startingPosition: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
            color: "grey",
            thickness: "8px",
            minSize: "15px"
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
                        <p className="linkText">Lägg till</p>
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
            }
          ]}
        >
            {meetingCategories.filter(mc => mc.category.parent_id === null)
                .map((meetingCategory, index) => {
                    const categoryIds = getCategoryAndChildrenIds(
                    meetingCategory.category.id
                    );

                    return (
                        <div className="categoryWrapper" style={{left: index * spacing, top: 0,}}>
                            <div key={meetingCategory.category.id}  className="categoryBlock">
                                <h3 className="cardTitle">{meetingCategory.category.category_name}</h3>
                                {!autoSortActive &&
                                    <>
                                        {allOffers.filter(filterOffers(categoryIds, meetingCategory.category.id, 1)).map(article =>
                                            /*
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
                                            */
                                            <ListCanvasArticles
                                                article={article}
                                                ownArticleInterest = {ownArticleInterest}
                                                removeMarkAsInterested = {removeMarkAsInterested}
                                                articleInterestCounter = {articleInterestCounter}
                                                handleInterestClick = {handleInterestClick}
                                            ></ListCanvasArticles>
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
                                    </>
                                }
                                {autoSortActive &&
                                    <div className="subCategoryBlock">
                                        {(() => {
                                            const clusterObj = categoryClusters.find(cc => Object.keys(cc)[0] === String(meetingCategory.category.id));
                                            const clusters = clusterObj?.[String(meetingCategory.category.id)] || [];
                                            return clusters.map((subCluster, subIndex) => (
                                                <div className='subCategoryDiv' key={subIndex}>
                                                    <h4 className="cardTitle">Kategori {subIndex + 1}</h4>
                                                    {allOffers.filter(offer => subCluster.includes(String(offer.id))).map(article =>
                                                        <ListCanvasArticles
                                                            article={article}
                                                            ownArticleInterest = {ownArticleInterest}
                                                            removeMarkAsInterested = {removeMarkAsInterested}
                                                            articleInterestCounter = {articleInterestCounter}
                                                            handleInterestClick = {handleInterestClick}
                                                        ></ListCanvasArticles>
                                                    )}
                                                    {allNeeds.filter(offer => subCluster.includes(String(offer.id))).map(article =>
                                                        <div key={article.id}  className="offerNeedCard needCard">
                                                            <p><b>{article.title}</b></p>
                                                            <div className="aboutArticle">
                                                                <p>{article.description}</p>
                                                                <p>Upplagt av: {article.end_user.user_name}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        })()}
                                    </div>
                                }
                            </div>
                            {!autoSortActive &&
                                <div className="subCategoryBlock">
                                    {meetingCategories.filter(sc => sc.category.parent_id === meetingCategory.category.id).map(subMeetingCategory => (
                                        <div className="subCategories">
                                            <div className='subCategoryDiv' key={subMeetingCategory.category.id}>
                                                <h4 className="cardTitle">{subMeetingCategory.category.category_name}</h4>
                                                {allOffers.filter(filterOffers(categoryIds, subMeetingCategory.category.id, 2)).map(article =>
                                                    /*
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
                                                    */
                                                    <ListCanvasArticles
                                                        article={article}
                                                        ownArticleInterest = {ownArticleInterest}
                                                        removeMarkAsInterested = {removeMarkAsInterested}
                                                        articleInterestCounter = {articleInterestCounter}
                                                        handleInterestClick = {handleInterestClick}
                                                    ></ListCanvasArticles>
                                                )}
                                                {allNeeds.filter(filterOffers(categoryIds, subMeetingCategory.category.id, 2)).map(article =>
                                                    <div key={article.id}  className="offerNeedCard needCard">
                                                        <p><b>{article.title}</b></p>
                                                        <div className="aboutArticle">
                                                            <p>{article.description}</p>
                                                            <p>Upplagt av: {article.end_user.user_name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    )
                }
            )}
        </ReactInfiniteCanvas>
        <div className="sortingDiv">
            <div className="autoSortDiv">
                <p className="autoSortButton" onClick={computeSimilarity}> 
                    Sortera automatiskt ✨
                </p>
                <div class="slidecontainer">
                    <label for="narrow">Smala kategorier</label>
                    <input 
                        type="range"
                        min="0.2"
                        max="0.8"
                        step="0.1"
                        value={epsilonSlider}
                        onChange={handleSliderChange}
                        class="slider"
                    />
                    <label for="wide">Breda kategorier</label>
                </div>
            </div>
            <p className="originalSortButton" onClick={resetSorting}>Ursprungliga kategorier</p>
        </div>

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