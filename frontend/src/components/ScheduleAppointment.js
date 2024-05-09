
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




    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2); 
    };

    
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTimeSlot('');
    };


    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setStep(3); 
    };


    const handleDetailsSubmit = async (details) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/patients/book`, {
                doctorId: selectedDoctor._id,
                userId: user._id,
                date: selectedDate.toLocaleDateString('en-CA'),
                time: selectedTimeSlot,
                ...details
            });
            
            
            setAppointmentDetails(response.data.appointment);
            setStep(4); 
        } catch (error) {
            console.error('Failed to book appointment:', error);
        }
    };

    
    const handleGoBack = () => {
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
