import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorNavbar from './DoctorNavbar.js';


const DoctorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const patientAppointments = [
        { patientName: 'John Doe', date: '11/02/24', time: '11:00am', type: 'In-Person', condition: 'Routine Checkup' },
    ];

    const handleAppointmentClick = (appointment) => {
        console.log("Viewing appointment:", appointment);
    };

    return (
        <div className="dashboard-container">
            <DoctorNavbar />
            <div className="main-content">
                <h1>Welcome, Dr. {user.name}!</h1>

                <div className="appointments-section">
                    <h3>Today's Appointments</h3>
                    <ul>
                        {patientAppointments.map((appt, index) => (
                            <li key={index} onClick={() => handleAppointmentClick(appt)}>
                                {appt.patientName} - {appt.date} at {appt.time} - {appt.type}
                                <li onClick={() => navigate(`/video-call/${appt.roomID}`)}>Join Video Call</li>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
