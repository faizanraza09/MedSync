import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';


function Home() {
    return (
        <div className="home-container"> 
        
            <div className="home-content">
                <h1 className="home-title">MedSync</h1>
                <div className="info-box">
                    <p className="home-subtitle">Integrated & intuitive EHR solution</p>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button className="button login-button">Login</button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <button className="button register-button">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;