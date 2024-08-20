import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './NewOfferForm.css'

const NewOfferForm = () => {

    const [formData, setFormData] = useState({
        userId: '7ed80514-953c-4d6f-baff-0946bf96f0d6',
        title: '',
        description: '', 
        available: '', 
        location: '',
        price: '',
        link: '', 
        availableDigitaly: false
    });

    const [status, setStatus] = useState(null);
    const navigate = useNavigate(); 


    const handleChange = (e) =>{

        let { name, value } = e.target;

        if(name == "availableDigitaly"){
            if(value === 'false'){
                value = false
            } else if (value === 'true'){
                value = true
            } 
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
            userId: '7ed80514-953c-4d6f-baff-0946bf96f0d6',
            title: '',
            description: '', 
            available: '', 
            location: '',
            price: '',
            link: '', 
            availableDigitaly: ''
        });
        navigate('/'); 
        } catch (error) {
        setStatus({ success: false, message: error.message });
    }
  };


    return (
        <>
            <div className="newOfferPage">
                <h1>Skapa ett nytt erbjudande</h1>
                <form onSubmit={handleSubmit} className="newOffer">
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
                        <div className='formDiv'>
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
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
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
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="button-small" role="button">
                        Create
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