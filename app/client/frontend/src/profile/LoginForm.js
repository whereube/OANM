import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../auth/AuthProvider';
import './LoginForm.css'

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
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
            setError({ success: false, message: result.message });
        }
    };

    return (
        <div>
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="button-small">Logga in</button>
                <a href="/profile/create-account">Skapa konto</a>
            </form>
        </div>
    );
};

export default LoginForm;
