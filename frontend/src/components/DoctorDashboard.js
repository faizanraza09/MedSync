import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import DoctorNavbar from './DoctorNavbar';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [dashboardInfo, setDashboardInfo] = useState({
        name: '',
        refCode: '',
        appointments: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/doctors/dashboard/${user._id}`);
                setDashboardInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard info:', error);
                setLoading(false);
            }
        };

        if (user && user._id) {
            fetchDashboardInfo();
        }
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="dashboard-container">
            <DoctorNavbar />
            <div className="main-content">
                <h1>Welcome, {dashboardInfo.name}!</h1>
                <p>Your Referral Code: {dashboardInfo.refCode}</p>
                <div className="appointments-section">
                    <h3>Today's Appointments</h3>
                    <ul>
                        {dashboardInfo.appointments.map((appt, index) => (
                            <li key={index}>
                                <p><strong>Patient:</strong> {appt.patientName}</p>
                                <p><strong>Date:</strong> {appt.date}</p>
                                <p><strong>Time:</strong> {appt.time}</p>
                                <p><strong>Reason:</strong> {appt.reason}</p>
                                <p><strong>Mode of Consultation:</strong> {appt.modeOfConsultation}</p>
                                <br/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
