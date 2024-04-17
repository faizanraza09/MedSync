import React from 'react';
import '../styles/Dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const patientAppointments = [
        { patientName: 'John Doe', date: '11/02/24', time: '11:00am', type: 'In-Person', condition: 'Routine Checkup' },
    ];

    const handleAppointmentClick = (appointment) => {
        console.log("Viewing appointment:", appointment);
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo-section">
                    <i className="fas fa-user-md"></i>
                    <h2>MedSync</h2>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><i className="fas fa-tachometer-alt"></i> Dashboard</li>
                        <li onClick={() => navigate('/manage-slots')}><i className="fas fa-clock"></i> Manage Slots</li>
                        <li><i className="fas fa-users"></i> My Patients</li>
                        <li><i className="fas fa-calendar-check"></i> Appointments</li>
                        <li><i className="fas fa-notes-medical"></i> Medical Records</li>
                        <li><i className="fas fa-comment-medical"></i> Consultations</li>
                        <li><i className="fas fa-cog"></i> Settings</li>
                    </ul>
                </nav>
                <div className="logout-section">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <div className="main-content">
                <h1>Welcome, Dr. {user.name}!</h1>

                <div className="appointments-section">
                    <h3>Today's Appointments</h3>
                    <ul>
                        {patientAppointments.map((appt, index) => (
                            <li key={index} onClick={() => handleAppointmentClick(appt)}>
                                {appt.patientName} - {appt.date} at {appt.time} - {appt.type}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
