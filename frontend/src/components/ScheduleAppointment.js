
import React, { useState } from 'react';
import DoctorSelection from './DoctorSelection';
import TimeSlotSelection from './TimeSlotSelection';
import AppointmentDetailsForm from './AppointmentDetailsForm';
import AppointmentConfirmation from './AppointmentConfirmation';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ScheduleAppointment.css';

const ScheduleAppointment = () => {
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [appointmentDetails, setAppointmentDetails] = useState({
        modeOfConsultation: '',
        reason: '',
    });
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };



    // Handle doctor selection
    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2); // Move to date and time slot selection
    };

    // Handle date change for slot selection
    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Reset the selected time slot when the date changes
        setSelectedTimeSlot('');
    };

    // Handle time slot selection
    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setStep(3); // Move to appointment details form
    };

    // Submit the appointment details
    const handleDetailsSubmit = async (details) => {
        try {
            const response = await axios.post('http://localhost:3001/api/patients/book', {
                doctorId: selectedDoctor._id,
                userId: user._id,
                date: selectedDate.toLocaleDateString('en-CA'),
                time: selectedTimeSlot,
                ...details
            });

            // Assuming the backend returns the confirmed appointment
            setAppointmentDetails(response.data);
            setStep(4); // Move to confirmation
        } catch (error) {
            console.error('Failed to book appointment:', error);
        }
    };

    // Reset state and go back to dashboard or step 1
    const handleGoBack = () => {
        // Reset all state
        setSelectedDoctor(null);
        setSelectedDate(new Date());
        setSelectedTimeSlot('');
        setAppointmentDetails({
            modeOfConsultation: '',
            reason: '',
        });
        setStep(1);
    };

    return (
        <div className="appointment-container">
            <aside className="sidebar">
                <div className="logo-section">
                    <i className="fas fa-user-doctor"></i>
                    <h2>MedSync</h2>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li onClick={() => navigate('/')}><i className="fas fa-home"></i> Dashboard</li>
                        <li onClick={() => navigate('/schedule-appointment')}><i className="fas fa-calendar-alt"></i> Appointments</li>
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
            <div className="content-area">
                {step === 1 && <DoctorSelection onDoctorSelect={handleDoctorSelect} onGoBack={handleGoBack} />}
                {step === 2 && (
                    <TimeSlotSelection
                        selectedDoctor={selectedDoctor}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        onTimeSlotSelect={handleTimeSlotSelect}
                        onGoBack={handleGoBack} />
                )}
                {step === 3 && <AppointmentDetailsForm onDetailsSubmit={handleDetailsSubmit} onGoBack={handleGoBack} />}
                {step === 4 && <AppointmentConfirmation appointmentDetails={appointmentDetails} onGoBack={handleGoBack} />}
            </div>
        </div>
    );
};

export default ScheduleAppointment;
