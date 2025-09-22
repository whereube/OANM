import React, { useState } from 'react';
import './CreateAccount.css';

const CreateAccount = (props) => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_URL}/resetPassword/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email
                }),
            });
            console.log('Response status:', response);
            if (response.status === 200) {
                /*props.setResetPassword(false)*/
                setSuccess('Återställningslänk skickad! Kontrollera din email, inklusive skräppostmappen.');
            } else if (response.status === 401) {
                const errorData = await response.json();
                setError(errorData.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Account creation error:', err);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className="create-account-form">
                <h2 className='createAccountTitle'>Återställ lösenord</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="button-small">Skicka återställningslänk</button>
            </form>
        </div>
    );
};

export default CreateAccount;
