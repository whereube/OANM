import React, { useState, useEffect } from 'react';
import './CreateAccount.css';
import { useAuth } from '../auth/AuthProvider';

const EditAccount = () => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [link, setLink] = useState('');
    const [error, setError] = useState(null);
    const [originalUserData, setOriginalUserData] = useState({})
    const { user } = useAuth();


    useEffect(() => {
        const getUserInfo = async () => {
            const response = await fetch(`${API_URL}/user/getUser/` + user.userId);
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.error('Error:', errorData); 
                throw new Error(errorData);
            }

            const result = await response.json();
            setOriginalUserData(result)
        } 
        if (user.hasOwnProperty('userId')){
            getUserInfo();
        }
    }, [user]);

    useEffect(() => {
        if(originalUserData.hasOwnProperty('user_name')){
            setEmail(originalUserData.email);
            setUserName(originalUserData.user_name);
            setPhoneNumber(originalUserData.phone_number);
            setLink(originalUserData.link);
            if(originalUserData.hasOwnProperty('company')){
                setCompanyName(originalUserData.company.company_name)
            }
        }
    }, [originalUserData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/user/editUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id: originalUserData.id,
                    email, 
                    user_name: userName, 
                    password, 
                    company_name: companyName, 
                    phone_number: phoneNumber, 
                    link 
                }),
            });

            if (response.status === 201) {
                alert('Informationen uppdaterad!')
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
                <h2>Redigera användare</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Användarnamn:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Lösenord:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Bekräfta lösenord:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Företag (valfritt):</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Telefonnummer (valfritt):</label>
                    <input
                        type="number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div>
                    <label>Länk (valfritt):</label>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="button-small">Spara ändringar</button>
            </form>
        </div>
    );
};

export default EditAccount;
