import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../auth/AuthProvider';
import CreateAccount from './CreateAccount';
import ResetPasswordRequest from './ResetPasswordRequest';
import './LoginForm.css'

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showCreateAccount, setShowCreateAccount] = useState(false)
    const [showResetPassword, setShowResetPassword] = useState(false)
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/article/showAll";


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        const formData = {
            email: email,
            password: password
        }

        const result = await auth.loginAction(formData);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError({ success: false, message: "Felaktiga inloggningsuppgifter" });
        }
    };

    const handleCreateAccountClick = () => {
        setShowCreateAccount(true)
    }
    const handleResetPasswordClick = () => {
        setShowResetPassword(true)
    }

    return (
        <div className='main-div'>
            {!showCreateAccount && !showResetPassword &&
                <div className='loginDiv'>
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Logga in</h2>
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
                            <label>Lösenord:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error.message}</p>}
                        <button type="submit" className="button-small">Logga in</button>
                        <p className='createAccountButton' onClick={handleCreateAccountClick}>Skapa konto</p>
                        <p className='createAccountButton forgot' onClick={handleResetPasswordClick}>Glömt lösenord</p>
                    </form>
                </div>
            }
            {showCreateAccount && 
                <div className='createAccountDiv'>
                    <CreateAccount
                        setShowCreateAccount={setShowCreateAccount}
                    />
                </div>
            },
            {showResetPassword && 
                <div className='resetPasswordDiv'>
                    <ResetPasswordRequest
                        setShowResetPassword={setShowResetPassword}
                    />
                </div>
            }
        </div>
    );
};

export default LoginForm;
