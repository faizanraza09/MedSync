import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/PatientAppointments.css';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/patients/${user._id}/appointments`);
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
        <div className="patient-appointments-page">
            <aside className="sidebar">
                <div className="logo-section">
                    <i className="fas fa-user-doctor"></i>
                    <h2>MedSync</h2>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li onClick={() => navigate('/')}><i className="fas fa-home"></i> Dashboard</li>
                        <li onClick={() => navigate('/appointments')}><i className="fas fa-calendar-alt"></i> Appointments</li>
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
            <div className="appointments-content-area">
                <h1>Your Appointments</h1>
                <div>
                    <ul>
                        {appointments.map((appointment, index) => (
                            <li key={index}>
                                {appointment.date} - {appointment.time} with Dr. {appointment.doctor}
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={() => navigate('/schedule-appointment')}>Schedule New Appointment</button>
            </div>
        </div>
    );
};

export default PatientAppointments;
