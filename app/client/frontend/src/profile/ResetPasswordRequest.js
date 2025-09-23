import React, { useState } from 'react';
import './CreateAccount.css';
import './ResetPasswordRequest.css';

const CreateAccount = (props) => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [emailSent, setEmailSent] = useState(null);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setEmailSent(true);
            const response = await fetch(`${API_URL}/resetPassword/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email
                }),
            });
            if (response.status === 200) {
                setSuccess('Finns ett konto kopplat till den angivna emailadressen har en återställningslänk skickats! Kontrollera din email, inklusive skräppostmappen.');
            } else if (response.status === 401) {
                const errorData = await response.json();
                setError(errorData.message);
            } else {
                setError('Ett fel uppstod, var god försök igen.');
            }
        } catch (err) {
            setError('Ett fel uppstod, var god försök igen.');
            console.error('Account creation error:', err);
        }
    };


    return (
        <div>
            {!emailSent &&
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
            }
            {emailSent &&
                <div className="success-message">
                    <h2>Länk skickad!</h2>
                    {success && <p style={{ color: 'black' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="button-small" onClick={() => props.setShowResetPassword(false)}>Tillbaka till inloggning</button>
                </div>
            }
        </div>
    );
};

export default CreateAccount;
