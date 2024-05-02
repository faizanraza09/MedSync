import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DoctorNavbar from './DoctorNavbar';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user } = useAuth();
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


    return (
        <div className="doctor-appointments-page">
            <DoctorNavbar />
            <div className="appointments-content-area">
                <h1>Scheduled Appointments</h1>
                <div>
                    <ul>
                        {appointments.map((appointment, index) => (
                            <li key={index} className="appointment-item">
                                <p><strong>Patient: </strong>{appointment.patientId.firstName} {appointment.patientId.lastName}</p>
                                <p><strong>Date: </strong>{appointment.date}</p>
                                <p><strong>Time: </strong>{appointment.time}</p>
                                <button onClick={() => navigate(`/video-call/${appointment.roomID}`)} className="join-video-call-btn">
                                    Join Video Call
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
