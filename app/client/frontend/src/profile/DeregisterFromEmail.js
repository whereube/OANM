import React, { useState } from 'react';
import './CreateAccount.css';
import './ResetPasswordRequest.css';
import './DeregisterFromEmail.css';
import { useParams } from "react-router-dom";

const DeregisterFromEmail = (props) => {
    let API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;
    const [deregistered, setDeregistered] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { userId } = useParams();




    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_URL}/notifications/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId
                }),
            });
            if (response.status === 200) {
                setDeregistered(true);
                setSuccess('Du har avregistrerats från framtida email utskick om dina erbjudanden.');
            } else if (response.status === 500) {
                const errorData = await response.json();
                setError("Avregistreringen misslyckades. Var god försök igen.");
            } else {
                setError('Ett fel uppstod, var god försök igen.');
            }
        } catch (err) {
            setError('Ett fel uppstod, var god försök igen.');
            console.error('Fel vid avregistrering:', err);
        }
    };


    return (
        <div className='deregister-main-div'>
            {!deregistered &&
                <form onSubmit={handleSubmit} className="create-account-form deregister-form">
                    <h2 className='createAccountTitle'>Avregistrering från email utskick</h2>
                    <button type="submit" className="button-small">Avregistrera</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            }
            {deregistered &&
                <div className="success-message">
                    <h2>Avregistreringen lyckades!</h2>
                    {success && <p style={{ color: 'black' }}>{success}</p>}
                </div>
            }
        </div>
    );
};

export default DeregisterFromEmail;
