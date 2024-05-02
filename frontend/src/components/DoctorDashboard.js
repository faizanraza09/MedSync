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
                const response = await axios.get(`http://localhost:3001/api/doctors/dashboard/${user._id}`);
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
                                {appt.patientName} - {appt.date} at {appt.time} - {appt.type}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
