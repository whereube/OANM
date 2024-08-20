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
    });

    const [status, setStatus] = useState(null);
    const navigate = useNavigate(); 


    const handleChange = (e) =>{

        const { name, value } = e.target;

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
                        <input
                            className="input-fields"
                            type="text"
                            id="available"
                            name="available"
                            value={formData.available}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='formDiv'>
                        <label htmlFor="location">Plats</label>
                        <input
                            className="input-fields"
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
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