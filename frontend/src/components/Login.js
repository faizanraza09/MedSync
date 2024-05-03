import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';
import axios from 'axios';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const auth = useAuth();
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');  
    };

    const handleGoToRegister = () => {
        navigate('/register');  
    };

    const checkEmailExists = async () => {
        if (!email) {
            return true;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/check-email-exists`, { email });
            setIsLoading(false);
            return response.data.exists;
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.response?.data.message);
            return false;
        }
    };

    const handleLogin = async () => {
        const emailExists = await checkEmailExists();

        if (!emailExists) {
            return;
        }

        try {
            const response = await auth.login(email, password);
            const user = response.user;
            // Redirect based on user role
            if (user.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else if (user.role === 'patient') {
                navigate('/patient-dashboard');
            }
        } catch (error) {
            setErrorMessage('Incorrect password');
        }
    };


    return (
        <div className="auth-container">
            <h2>Login</h2>
            <div>
                <label className="auth-label">Email:</label>
                <input className="auth-input" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            </div>
            <div>
                <label className="auth-label">Password:</label>
                <input className="auth-input" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            </div>
            <button className="auth-button" onClick={handleLogin}>Login</button>
            <button className="auth-button" type="button" onClick={handleGoToRegister}>Don't have an Account? Register!</button>
            {/* <button className="auth-button" type="button" onClick={handleBackToHome}>Back to Home</button> */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default Login;