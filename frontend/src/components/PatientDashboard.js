import React from 'react';
import '../PatientDashboard.css'; // Import the dashboard CSS
import { useAuth } from '../contexts/AuthContext';


const PatientDashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };
    const appointments = [
        { doctor: 'Doctor Jenny', date: '11/01/24', time: '10:30pm', location: 'Online' },
    ];

    const notifications = [
        { message: 'Doctor Jenny changed the timing of...', time: '10:44pm' },
    ];

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo-section">
                    <i className="fas fa-user-doctor"></i>
                    <h2>MedSync</h2>
                </div>

                {/* Navigation Menu */}
                <nav className="nav-menu">
                    <ul>
                        <li><i className="fas fa-home"></i> Dashboard</li>
                        <li><i className="fas fa-calendar-alt"></i> Appointments</li>
                        <li><i className="fas fa-envelope"></i> Messages</li>
                        <li><i className="fas fa-file-medical-alt"></i> Medical Records</li>
                        <li><i className="fas fa-user-md"></i> Doctors</li>
                        <li><i className="fas fa-capsules"></i> Prescriptions</li>
                        <li><i className="fas fa-cog"></i> Settings</li>
                    </ul>
                </nav>
                <div className="logout-section">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <div className="main-content">
                <h1>Welcome Back!</h1>
                <h2>Ayesha Rashid</h2>

                <div className="appointments-section">
                    <h3>Upcoming Appointments</h3>
                    <ul>
                        {appointments.map((appt, index) => (
                            <li key={index}>
                                {appt.doctor} - {appt.date} at {appt.time} - {appt.location}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="notifications-section">
                    <h3>Notifications</h3>
                    <ul>
                        {notifications.map((note, index) => (
                            <li key={index}>{note.message} - <span>{note.time}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
