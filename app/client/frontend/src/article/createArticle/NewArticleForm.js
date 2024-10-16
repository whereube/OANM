import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from '../../auth/AuthProvider';
import './NewArticleForm.css'

const NewArticleForm = () => {

    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    let { meetingId } = useParams();
    const navigate = useNavigate(); 
    const location = useLocation();
    const meetingIdParam = meetingId
    const [categories, setCategories] = useState([])
    const [meetingCategories, setMeetingCategories] = useState([])
    const [addOffer, setAddOffer] = useState(true)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        userId: '',
        title: '',
        description: '', 
        available: '', 
        location: '',
        price: 0,
        link: '', 
        availableDigitaly: false,
        meetingId: meetingIdParam !== undefined ? meetingIdParam : null,
        articleCategories: {}
    });

    const [status, setStatus] = useState(null);
    const [previouslyCreatedOffers, setPreviouslyCreatedOffers] = useState([]);
    const [previouslyCreatedNeeds, setPreviouslyCreatedNeeds] = useState([]);
    const [offerOrNeedParam, setOfferOrNeedParam] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('offerOrNeed') || '';
    });
    const { user } = useAuth();


    useEffect(() => {
        const storedUserId = localStorage.getItem('sessionId');
        if (storedUserId) {
            setFormData((prevData) => ({
                ...prevData,
                userId: storedUserId
            }));
        }
    }, []);

    useEffect(() => {
        getMeetingCategories();
        getCategories();
    }, []);

    useEffect(() => {
        if(offerOrNeedParam === 'offer'){
            setAddOffer(true)
        }
        else if(offerOrNeedParam === 'need'){
            setAddOffer(false)
        }
    }, [offerOrNeedParam]);

    useEffect(() => {
        if(user.userId !== undefined){
            getPreviouslyCreatedOffers();
            getPreviouslyCreatedNeeds();
        }
    }, [meetingId, user]);

    const getPreviouslyCreatedOffers = async () => {
        try {
            const response = await fetch(`${API_URL}/offers/byMeetingAndUserId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicates that the body of the request contains JSON
                },
                body: JSON.stringify({userId: user.userId, meetingId: meetingId}) // Convert dataToSend to JSON string
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.error('Error:', errorData); 
                throw new Error(errorData);
            } else {
                const result = await response.json();
                setPreviouslyCreatedOffers(result)
            }
        } catch (error) {
            console.error('Error:', error); 
        }
    }

    const getPreviouslyCreatedNeeds = async () => {
        try {
            const response = await fetch(`${API_URL}/needs/byMeetingAndUserId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicates that the body of the request contains JSON
                },
                body: JSON.stringify({userId: user.userId, meetingId: meetingId}) // Convert dataToSend to JSON string
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.error('Error:', errorData); 
                throw new Error(errorData);
            } else {
                const result = await response.json();
                setPreviouslyCreatedNeeds(result)
            }
        } catch (error) {
            console.error('Error:', error); 
        }
    }



    const handleChange = (e) =>{

        let { name, value } = e.target;

        if(name == "availableDigitaly"){
            if(value === 'false'){
                value = false
            } else if (value === 'true'){
                value = true
            } 
        }

        if(name == "price" && value !== null){
            value = parseInt(value)
        }

        if(name.includes('category')){
            setFormData((prevData) => {
                const newCategory = { [name]: value };
                const currentLevel = parseInt(name.split('_')[1], 10)

                
                const updatedCategories = {
                    ...prevData.articleCategories,
                    ...newCategory
                };

                Object.keys(updatedCategories).forEach(key => {
                    const keyLevel = parseInt(key.split('_')[1], 10)
                    if (keyLevel > currentLevel) {
                        delete updatedCategories[key];
                    }
                });

                return {
                    ...prevData,
                    articleCategories: updatedCategories
                };
            });

        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = []

            if(addOffer === true){
                response = await fetch(`${API_URL}/offers/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indicates that the body of the request contains JSON
                    },
                    body: JSON.stringify(formData) // Convert dataToSend to JSON string
                });
            } else {
                response = await fetch(`${API_URL}/needs/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indicates that the body of the request contains JSON
                    },
                    body: JSON.stringify(formData) // Convert dataToSend to JSON string
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.error('Error:', errorData); 
                throw new Error(errorData);
            }

            const result = await response.json();
            if (addOffer) {
                setStatus({ success: true, message: 'Erbjudande tillagt' });
            } else {
                setStatus({ success: true, message: 'Behov tillagt' });
            }
            // Clear form fields
            setFormData({
                userId: '',
                title: '',
                description: '', 
                available: '', 
                location: '',
                price: '',
                link: '', 
                availableDigitaly: false,
                meetingId: meetingIdParam != undefined ? meetingIdParam : null,
                articleCategories: {}
            });
            if (addOffer) {
                navigate(`?offerOrNeed=offer`);
            } else {
                navigate(`?offerOrNeed=need`);
            }
            window.location.reload();
        } catch (error) {
            setStatus({ success: false, message: error.message });
        }
    };

    const getCategories = async () => {
        const response = await fetch(`${API_URL}/category/getAll`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setCategories(result)
    }

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
        setLoading(false)
    }

    useEffect(() => {
        document.querySelectorAll('.select').forEach(child => {
            if (child.querySelectorAll('.option').length === 0) {
                child.classList.add('hideIfNoCategory');
            } else {
                child.classList.remove('hideIfNoCategory');
            }
        });
    }, [formData.articleCategories, categories]);

    const toggleOffersOrNeeds = (offerToBeAdded) => {
        setAddOffer(offerToBeAdded)
    }


    return (
        <>
            {!loading ? (
                <div className="newOfferPage">
                    <div className='AddOfferOrNeed'>
                        <div className='buttonsDiv'>
                            <p className={`OfferOrNeedButton ${addOffer && 'active'} `} onClick={() => toggleOffersOrNeeds(true)}>Erbjudanden</p>
                            <p className={`OfferOrNeedButton ${addOffer === false && 'active'} `} onClick={() => toggleOffersOrNeeds(false)}>Behov</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="newOffer">
                        {addOffer ? (
                            <h2>Skapa erbjudande</h2>
                        ) : (
                            <h2>Skapa behov</h2>
                        )}
                        <div className='formFields'>
                            <div className='formDiv'>
                                <label htmlFor="title">Titel</label>
                                <input
                                    className="input-fields"
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='formDiv'>
                                <label htmlFor="description">Beskrivning</label>
                                <textarea
                                    className="input-fields"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {meetingIdParam == undefined && (
                                <div>
                                    <div className='formDiv'>
                                        <label htmlFor="available">Tillgänglig</label>
                                        <select
                                            className="input-fields"
                                            id="available"
                                            name="available"
                                            value={formData.available}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="begränsad">Begränsad</option>
                                            <option value="alltid">Alltid</option>
                                        </select>
                                    </div>
                                    <div className='formDiv selectDiv'>
                                        <label htmlFor="availableDigitaly">Plats</label>
                                        <select
                                            className="input-fields"
                                            id="availableDigitaly"
                                            name="availableDigitaly"
                                            value={formData.availableDigitaly}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="true">Digitalt tillgänglig (oberoende av plats)</option>
                                            <option value="false">Specifik plats</option>
                                        </select>
                                        {formData.availableDigitaly == false && (
                                            <div className='formDiv'>
                                                <label htmlFor="physicalLocation">Ort (alternativt stad eller kommun)</label>
                                                <input
                                                    className="input-fields"
                                                    type="text"
                                                    id="physicalLocation"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className='formDiv'>
                                        <label htmlFor="price">Pris</label>
                                        <input
                                            className="input-fields"
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {addOffer === true && (
                                        <div className='formDiv'>
                                            <label htmlFor="link">Länk</label>
                                            <input
                                                className="input-fields"
                                                type="text"
                                                id="link"
                                                name="link"
                                                value={formData.link}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className='formDiv selectDiv'>
                                    <label htmlFor="category_1">Kategori</label>
                                    <select
                                        className="input-fields select"
                                        id="category_1"
                                        name="category_1"
                                        value={formData.category_1}
                                        onChange={handleChange}
                                        required
                                        defaultValue={""}
                                    >
                                        <option value="" disabled>Välj en kategori</option>
                                        {meetingCategories.map(category => (
                                            category.category.parent_id === null && (
                                                <option className="option" key={category.category.id} value={category.category.id}>{category.category.category_name}</option>
                                            )
                                        ))}
                                    </select>
                                    {formData.articleCategories['category_1'] !== undefined && formData.articleCategories['category_1'] !== '' &&(
                                        <select
                                            className="input-fields select"
                                            id="category_2"
                                            name="category_2"
                                            value={formData.category_2}
                                            onChange={handleChange}
                                            defaultValue={""}
                                        >
                                            <option value="" disabled>Välj en kategori</option>
                                            {meetingCategories.map(subCategory => (
                                                    subCategory.category.parent_id === formData.articleCategories['category_1'] && (
                                                        <option className="option" key={subCategory.category.id} value={subCategory.category.id}>{subCategory.category.category_name}</option>
                                                    )
                                            ))}
                                        </select>
                                    )}
                            </div>
                        </div>
                        <button type="submit" className="button-small" role="button">
                            Skapa
                        </button>
                    </form>
                    {status && (
                        <div>
                            {status.success ? (
                                <p style={{ color: 'green' }}>{status.message}</p>
                            ) : (
                                <p style={{ color: 'red' }}>{status.message}</p>
                            )}
                        </div>
                    )}
                        {addOffer ? (
                            <div className='previouslyCreatedDiv'>
                                <h4>Dina tidigare skapade erbjudanden för detta möte: </h4>
                                {previouslyCreatedOffers.map(article => (
                                    <p key={article.id} className='previouslyCreatedArticle'>{article.title}</p>
                                ))}
                            </div>
                        ) : (
                            <div className='previouslyCreatedDiv'>
                                <h4>Dina tidigare skapade behov för detta möte: </h4>
                                {previouslyCreatedNeeds.map(article => (
                                    <p key={article.id} className='previouslyCreatedArticle'>{article.title}</p>
                                ))}
                            </div>
                        )}

                </div>
            ): (
                <p>Laddar...</p>
            )}
        </>
    )
}

export default NewArticleForm