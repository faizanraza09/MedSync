import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const DoctorNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="logo-section">
                <i className="fas fa-user-md"></i>
                <h2>MedSync</h2>
            </div>
            <nav className="nav-menu">
                <ul>
                    <li onClick={() => navigate('/doctor-dashboard')}><i className="fas fa-tachometer-alt"></i> Dashboard</li>
                    <li onClick={() => navigate('/manage-slots')}><i className="fas fa-clock"></i> Manage Slots</li>
                    <li onClick={() => navigate('/doctor-appointments')}><i className="fas fa-calendar-check"></i> Appointments</li>
                    <li onClick={() => navigate('/upload-medical-records')}><i className="fas fa-notes-medical"></i> Medical Records</li>
                    <li onClick={() => navigate('/diagnostics')}><i className="fa-solid fa-brain"></i>Diagnostics</li>
                    <li onClick={() => navigate('/patients')}><i className="fas fa-users"></i>Prescribe Medication</li>
                </ul>
            </nav>
            <div className="logout-section">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </aside>
    );
};

export default DoctorNavbar;
