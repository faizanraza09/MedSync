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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patients/${user._id}/appointments`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [user]);

    const isAppointmentToday = (appointmentDate) => {
        const today = new Date();
        const appointment = new Date(appointmentDate);
        return (
            today.getFullYear() === appointment.getFullYear() &&
            today.getMonth() === appointment.getMonth() &&
            today.getDate() === appointment.getDate()
        );
    };


    return (
        <div className="patient-appointments-page">
            <PatientNavbar />
            <div className="appointments-content-area">
                <h1>Your Appointments</h1>
                <ul>
                    {appointments.map((appointment, index) => (
                        <li key={index} className="appointment-item">
                            <div className="appointment-details">
                                <p><strong>Doctor: </strong>{appointment.doctor}</p>
                                <p><strong>Date: </strong>{appointment.date}</p>
                                <p><strong>Time: </strong>{appointment.time}</p>
                                <p><strong>Reason: </strong>{appointment.reason}</p>
                                <p><strong>Mode of Consultation: </strong>{appointment.modeOfConsultation}</p>
                            </div>
                            {appointment.modeOfConsultation === 'Video' && (
                                <button
                                    onClick={() => navigate(`/video-call/${appointment.roomID}`)}
                                    className={`join-video-call-btn ${isAppointmentToday(appointment.date) ? '' : 'disabled'}`}
                                    disabled={!isAppointmentToday(appointment.date)}
                                >
                                    Join Video Call
                                </button>
                            )}


                        </li>
                    ))}
                </ul>
                <button onClick={() => navigate('/schedule-appointment')} className="schedule-new-appointment-btn">
                    Schedule New Appointment
                </button>
            </div>
        </div>
    );
};

export default PatientAppointments;
