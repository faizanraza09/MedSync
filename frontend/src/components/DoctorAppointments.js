import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorAppointments.css';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/doctors/${user._id}/appointments`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="doctor-appointments-page">
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

            <div className="appointments-content-area">
                <h1>Scheduled Appointments</h1>
                <div>
                    <ul>
                        {appointments.map((appointment, index) => (
                            <li key={index}>
                                {appointment.date} - {appointment.time} with {appointment.patientName}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
