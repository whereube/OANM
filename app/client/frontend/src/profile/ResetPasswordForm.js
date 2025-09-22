import React, { useState } from 'react';
import './CreateAccount.css';
import { useParams } from "react-router-dom";


const CreateAccount = (props) => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [error, setError] = useState(null);
    const { token } = useParams();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Lösenorden stämmer inte överens. Var god försök igen.');
            return;
        }
        console.log('Token from params:', token);

        /*
        try {
            const response = await fetch(`${API_URL}/user/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    user_name: userName, 
                    password, 
                    company_name: companyName, 
                    phone_number: phoneNumber, 
                    link 
                }),
            });
            
            if (response.status === 201) {
                const userData = await response.json();
                localStorage.setItem('sessionId', userData.result.id);
                props.setShowCreateAccount(false)
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
        */
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className="create-account-form">
                <h2 className='createAccountTitle'>Byt lösenord</h2>
                <div>
                    <label>Lösenord:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Bekräfta lösenord:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="button-small">Byt lösenord</button>
            </form>
        </div>
    );
};

export default CreateAccount;
