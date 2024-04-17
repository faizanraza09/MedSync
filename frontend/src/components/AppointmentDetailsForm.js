// AppointmentDetailsForm.js

import React, { useState } from 'react';
import '../styles/AppointmentDetailsForm.css';

const AppointmentDetailsForm = ({ onDetailsSubmit }) => {
    const [details, setDetails] = useState({
        modeOfConsultation: '',
        reason: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDetails({
            ...details,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onDetailsSubmit(details);
    };

    return (
        <form onSubmit={handleSubmit} className="appointment-details-form">
            <div className="form-group">
                <label htmlFor="modeOfConsultation">Preferred Mode of Consultation:</label>
                <select
                    name="modeOfConsultation"
                    id="modeOfConsultation"
                    value={details.modeOfConsultation}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Consultation Mode</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Video">Video Consultation</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="reason">Reason for Booking Appointment:</label>
                <textarea
                    name="reason"
                    id="reason"
                    value={details.reason}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary">
                Book Appointment
            </button>
        </form>
    );
};

export default AppointmentDetailsForm;
