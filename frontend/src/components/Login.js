import React, { useState } from 'react';
import axios from 'axios';
// If using react-router-dom for navigation
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Hook to programmatically navigate
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ email, password });

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, body, config);


            localStorage.setItem('token', res.data.token);

            navigate('/dashboard');

        } catch (error) {
            console.error(error.response.data);
            // Display an error message to your user
            alert('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label className="auth-label">Email:</label>
                    <input className="auth-input" type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div>
                    <label className="auth-label">Password:</label>
                    <input className="auth-input" type="password" name="password" value={password} onChange={onChange} required />
                </div>
                <button className="auth-button" type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
