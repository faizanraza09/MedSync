import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await auth.login(email, password);
            navigate(`/dashboard`);
        } catch (error) {
            alert('Login failed: Incorrect username or password');
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
        </div>
    );
}

export default Login;
