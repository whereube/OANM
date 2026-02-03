import React, { useState } from 'react';
import './CreateAccount.css';
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";



const CreateAccount = (props) => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Lösenorden stämmer inte överens. Var god försök igen.');
            return;
        }
        console.log('Token from params:', token);

        try {
            const response = await fetch(`${API_URL}/resetPassword/password-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: token, 
                    password: password
                }),
            });
            
            if (response.status === 200) {
                setSuccess(true);
                setSuccessMessage('Lösenordet har ändrats. Du kan nu logga in med ditt nya lösenord.');
            } else if (response.status === 400) {
                setError('Lösenordet kan inte vara tomt.');
            } else if (response.status === 403) {
                setError('Ogiltig, förbrukad eller utgången återställningslänk. Var god begär en ny återställningslänk via "Glömt lösenord" på inloggningssidan.'); 
            }
            else if (response.status === 500) {
                setError('Användaren uppdaterades inte. Var god försök igen.');
            }
            else {
                setError('Något gick fel. Var god försök igen.');
            }
        } catch (err) {
            setError('Något gick fel. Var god försök igen.');
            console.error('Account creation error:', err);
        }
    };


    return (
        <div>
            {!success &&
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
            }
            {success && 
                <div className='success-message'>
                    <h2>{successMessage}</h2>
                    <button onClick={() => navigate('/profile/login')} className="button-small">Till inloggning</button>
                </div>
            }
        </div>
    );
};

export default CreateAccount;
