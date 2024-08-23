import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './NewOfferForm.css'

const NewOfferForm = () => {

    let { meetingId } = useParams();
    const meetingIdParam = meetingId

    const [formData, setFormData] = useState({
        userId: '',
        title: '',
        description: '', 
        available: '', 
        location: '',
        price: 0,
        link: '', 
        availableDigitaly: false,
        meetingId: meetingIdParam != undefined ? meetingIdParam : null,
        category_1: null
    });

    const [status, setStatus] = useState(null);
    const navigate = useNavigate(); 

    console.log(meetingIdParam)

    useEffect(() => {
        const storedUserId = localStorage.getItem('sessionId');
        if (storedUserId) {
            setFormData((prevData) => ({
                ...prevData,
                userId: storedUserId
            }));
        }
    }, []);

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

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:443/offers/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indicates that the body of the request contains JSON
            },
            body: JSON.stringify(formData) // Convert dataToSend to JSON string
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData); 
            throw new Error(errorData);
        }

        const result = await response.json();
        setStatus({ success: true, message: 'Offer added successfully!' });
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
            category_1: null
        });
        navigate('/'); 
        } catch (error) {
        setStatus({ success: false, message: error.message });
    }
  };


    return (
        <>
            <div className="newOfferPage">
                <form onSubmit={handleSubmit} className="newOffer">
                    <h2>Skapa erbjudande</h2>
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
                            </div>
                        )}
                        {meetingIdParam !== undefined && (
                            <div className='formDiv selectDiv'>
                                    <label htmlFor="category_1">Kategori</label>
                                    <select
                                        className="input-fields"
                                        id="category_1"
                                        name="category_1"
                                        value={formData.category_1}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="aeb778ee-939d-44e4-8f57-8810c3347dae">Lokaler</option>
                                        <option value="6a319924-f2d3-4813-8103-7ad7fc7676ce">Evenemang</option>
                                        <option value="2b6af113-55d2-4bcc-9066-d17196ffd745">Övrigt</option>
                                    </select>
                            </div>
                        )}
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
            </div>
        </>
    )
}

export default NewOfferForm