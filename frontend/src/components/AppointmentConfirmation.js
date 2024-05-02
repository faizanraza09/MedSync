// AppointmentConfirmation.js
import React from 'react';
import '../styles/AppointmentConfirmation.css'; // Ensure you have the CSS for styling

const AppointmentConfirmation = ({ appointmentDetails, onGoBack }) => {
    // Destructure appointmentDetails for easy access
    const { doctorId, date, time, modeOfConsultation, reason } = appointmentDetails;

    return (
        <div className="appointment-confirmation">
            <h2>Booking Confirmed!</h2>
            <div className="confirmation-details">
                <p><strong>Doctor:</strong> Dr {doctorId.firstName} {doctorId.lastName}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Mode of Consultation:</strong> {modeOfConsultation}</p>
                <p><strong>Reason for Visit:</strong> {reason}</p>
            </div>
            <button onClick={onGoBack} className="confirm-btn">Back to Dashboard</button>
        </div>
    );
};

export default AppointmentConfirmation;
