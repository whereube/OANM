import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './EditArticle.css'


const EditArticle = () => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(true);
    const [meetingCategories, setMeetingCategories] = useState([])
    const [previousArticleCategories, setPreviousArticleCategories] = useState([])
    const [formData, setFormData] = useState({
        title: '',
        description: '', 
        articleCategories: {}
    });
    let { id, offerOrNeed } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        getArticle();
    }, []);

    useEffect(() => {
        console.log(formData)
    }, [formData]);

    useEffect(() => {
        if(article.hasOwnProperty('id')){
            getMeetingCategories();
            getArticleCategories();
            setFormData((prevData) => ({
                ...prevData,
                title: article.title,
                description: article.description
            }));
        }
    }, [article]);

    useEffect(() => {
        setStartValueOfCategories();
        setLoading(false)
    }, [previousArticleCategories, meetingCategories]);


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

    const getMeetingCategories = async () => {

        const response = await fetch(`${API_URL}/meetingCategory/byMeetingId/` + article.meeting_id);
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

    const getArticleCategories = async () => {
        const categoryIds = []

        const response = await fetch(`${API_URL}/articleCategory/byArticleId/` + article.id);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        result.forEach(category => {
            categoryIds.push(category.category_id)
        })
        setPreviousArticleCategories(categoryIds)
        setLoading(false)
    }

    const handleChange = (e) =>{

        let { name, value } = e.target;
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

    const setStartValueOfCategories = () => {
        let category1Id;
        meetingCategories.forEach(category => {
            if (category.category.parent_id === null && previousArticleCategories.includes(category.category.id)) {
                category1Id = category.category.id;
                setFormData((prevData) => ({
                    ...prevData,
                    articleCategories: {
                        ...prevData.articleCategories,
                        ['category_1']: category.category.id
                    }
                }));
            }
        });
        meetingCategories.forEach(subCategory => {
                if(subCategory.category.parent_id === category1Id && previousArticleCategories.includes(subCategory.category.id)) {
                    setFormData((prevData) => ({
                        ...prevData,
                        articleCategories: {
                            ...prevData.articleCategories,
                            ['category_2']: subCategory.category.id 
                        }
                    }));
                }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = []

            if(offerOrNeed === 'offer'){
                response = await fetch(`${API_URL}/offers/edit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({articleId: article.id, title: formData.title, description: formData.description}) 
                });
            } else {
                response = await fetch(`${API_URL}/needs/edit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({articleId: article.id, title: formData.title, description: formData.description})
                });
            }
            const categoriesFromForm = []
            if(formData.articleCategories.hasOwnProperty('category_1')){
                categoriesFromForm.push(formData.articleCategories['category_1'])
                if(formData.articleCategories.hasOwnProperty('category_2')){
                    categoriesFromForm.push(formData.articleCategories['category_2'])
                }
            }
            if(categoriesFromForm.length > 0){
                const newCategories = categoriesFromForm.filter((element) => !previousArticleCategories.includes(element));
                const removedCategories = previousArticleCategories.filter((element) => !categoriesFromForm.includes(element))
                if(removedCategories.length > 0){
                    response = await fetch(`${API_URL}/articleCategory/removeCategories`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({categoryIds: removedCategories, articleId: article.id})
                    });
                }

                if(newCategories.length > 0){
                    response = await fetch(`${API_URL}/articleCategory/addCategoriesByList`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({categoryIds: newCategories, articleId: article.id})
                    });
                }
            }
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.error('Error:', errorData); 
                throw new Error(errorData);
            } else {
                alert('Artikeln har uppdaterats')
                window.location.reload();
            }
        } catch (error) {
            console.error({ success: false, message: error.message });
        }
    };


    return (
            <>
                <div className='articlePage'>
                    {loading !== true ? (
                        <>
                            <form className="newOffer editOffer" onSubmit={handleSubmit}>
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
                                </div>
                                <div className='formDiv selectDiv'>
                                    <label htmlFor="category_1">Kategori</label>
                                    <select
                                        className="input-fields select"
                                        id="category_1"
                                        name="category_1"
                                        value={formData.articleCategories['category_1'] || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option disabled value="">Välj kategori</option>
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
                                            value={formData.articleCategories['category_2'] || ""}
                                            onChange={handleChange}
                                        >
                                            <option disabled value="">Välj underkategori</option>
                                            {meetingCategories.map(subCategory => (
                                                    subCategory.category.parent_id === formData.articleCategories['category_1'] && (
                                                        <option className="option" key={subCategory.category.id} value={subCategory.category.id}>{subCategory.category.category_name}</option>
                                                    )
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <button type="submit" className="button-small" role="button">
                                    Spara ändringar
                                </button>
                            </form>
                        </>
                    ): (
                        <p>Laddar...</p>
                    )}
                </div>
            </>
        )
}

export default EditArticle