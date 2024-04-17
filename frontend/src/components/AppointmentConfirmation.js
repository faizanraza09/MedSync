// AppointmentConfirmation.js
import React from 'react';

const AppointmentConfirmation = ({ onConfirm }) => {
    return (
        <div className="appointment-confirmation">
            <h2>Booking Confirmed!</h2>
            <button onClick={onConfirm} className="confirm-btn">Back to Dashboard</button>
        </div>
    );
};

export default AppointmentConfirmation;
