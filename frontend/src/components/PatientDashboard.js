import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PatientNavbar from './PatientNavbar';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
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
    }, [user._id]);

    // const appointments = [
    //     { doctor: 'Doctor Jenny', date: '11/01/24', time: '10:30pm', location: 'Online' },
    // ];

    const notifications = [
        { message: 'Doctor Jenny changed the timing of...', time: '10:44pm' },
    ];

    return (
        <div className="dashboard-container">
            <PatientNavbar/>
            <div className="main-content">
                <h1>Welcome Back!</h1>
                <h2>Ayesha Rashid</h2>

                <div className="appointments-section">
                    <h3>Upcoming Appointments</h3>
                    <ul>
                        {appointments.map((appt, index) => (
                            <li key={index}>
                                Doctor {appt.doctor} - {appt.date} at {appt.time} - {appt.modeOfConsultation}
                                <li onClick={() => navigate(`/video-call/${appt.roomID}`)}>Join Video Call </li>
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
