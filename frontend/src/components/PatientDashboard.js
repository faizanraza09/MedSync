import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import PatientNavbar from './PatientNavbar';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [nearestAppointment, setNearestAppointment] = useState(null);
    const [patientName, setPatientName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/patients/${user._id}/appointments`);
                const sortedAppointments = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                console.log('Appointments:', sortedAppointments);
        
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today's date to start of the day for accurate comparison
        
                setNearestAppointment(sortedAppointments.find(appt => new Date(appt.date) >= today));
                setAppointments(sortedAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/patients/details/${user._id}`);
                setPatientName(`${response.data.firstName} ${response.data.lastName}`);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };

        if (user && user._id) {
            fetchAppointments();
            fetchPatientDetails();
        }
    }, [user._id]);

    return (
        <div className="dashboard-container">
            <PatientNavbar />
            <div className="main-content">
                <h1>Welcome Back, {patientName}!</h1>
                <div className="appointments-section">
                    <h3>Your Next Appointment</h3>
                    {nearestAppointment ? (
                        <div>
                            <p><strong>Doctor:</strong> {nearestAppointment.doctor}</p>
                            <p><strong>Date:</strong> {nearestAppointment.date}</p>
                            <p><strong>Time:</strong> {nearestAppointment.time}</p>
                            <p><strong>Reason:</strong> {nearestAppointment.reason}</p>
                            <p><strong>Mode of Consultation:</strong> {nearestAppointment.modeOfConsultation}</p>
                        </div>
                    ) : (
                        <p>No upcoming appointments found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
