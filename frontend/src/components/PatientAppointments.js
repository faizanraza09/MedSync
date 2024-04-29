import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/PatientAppointments.css';
import PatientNavbar from './PatientNavbar';


const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user } = useAuth();

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


    return (
        <div className="patient-appointments-page">
            <PatientNavbar />
            <div className="appointments-content-area">
                <h1>Your Appointments</h1>
                <div>
                    <ul>
                        {appointments.map((appointment, index) => (
                            <li key={index}>
                                {appointment.date} - {appointment.time} with Dr. {appointment.doctor}
                                <li onClick={() => navigate(`/video-call/${appointment.roomID}`)}>Join Video Call </li>
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
