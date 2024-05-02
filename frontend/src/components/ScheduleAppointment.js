
import React, { useState } from 'react';
import DoctorSelection from './DoctorSelection';
import TimeSlotSelection from './TimeSlotSelection';
import AppointmentDetailsForm from './AppointmentDetailsForm';
import AppointmentConfirmation from './AppointmentConfirmation';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ScheduleAppointment.css';
import PatientNavbar from './PatientNavbar';

const ScheduleAppointment = () => {
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [appointmentDetails, setAppointmentDetails] = useState({});
    const { user } = useAuth();

    const navigate=useNavigate();




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
            setAppointmentDetails(response.data.appointment);
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
        navigate('/appointments');
    };

    return (
        <div className="appointment-container">
            <PatientNavbar />
            <div className="content-area">
                {step === 1 && <DoctorSelection user={user} onDoctorSelect={handleDoctorSelect} onGoBack={handleGoBack} />}
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
