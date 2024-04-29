import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
                <i className="fas fa-user-doctor"></i>
                <h2>MedSync</h2>
            </div>

            <nav className="nav-menu">
                <ul>
                    <li><i className="fas fa-home"></i> Dashboard</li>
                    <li onClick={() => navigate('/appointments')}><i className="fas fa-calendar-alt"></i> Appointments</li>
                    <li><i className="fas fa-envelope"></i> Messages</li>
                    <li onClick={() => navigate('/medical-records')}><i className="fas fa-file-medical-alt"></i> Medical Records</li>
                    <li><i className="fas fa-user-md"></i> Doctors</li>
                    <li onClick={() => navigate('/prescriptions')}><i className="fas fa-capsules"></i> Prescriptions</li>
                </ul>
            </nav>
            <div className="logout-section">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </aside>
    );
};

export default DoctorNavbar;
