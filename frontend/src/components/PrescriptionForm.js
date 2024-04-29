
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams
import { useAuth } from '../contexts/AuthContext';


import axios from 'axios';

function PrescriptionForm() {

    const { user } = useAuth();


    const userId = user._id;
    console.log("doctor issuing iss ", userId);

    const [formData, setFormData] = useState({
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: '',
        doctorId: userId
    });

    const { patientId } = useParams(); // Extract patientId from URL parameters
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if the form has been submitted successfully
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3001/api/patients/${patientId}/prescribe`, formData);
            alert('Prescription added successfully');
            setIsSubmitted(true); // Set the submitted state to true

        } catch (error) {
            console.error('Failed to add prescription:', error);
            alert('Failed to add prescription');
        }
    };

    if (isSubmitted) {
        // Display the confirmation message if the form has been successfully submitted
        return <div>
            <h2>Prescription Added Successfully!</h2>
            <p>Your prescription has been successfully submitted.</p>
            <button onClick={() => navigate('/doctor-dashboard')}>Back to dashboard</button>
        </div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Prescribe Medication</h2>
            <input name="medicineName" value={formData.medicineName} onChange={handleChange} placeholder="Medicine Name" required />
            <input name="dosage" value={formData.dosage} onChange={handleChange} placeholder="Dosage" required />
            <input name="frequency" value={formData.frequency} onChange={handleChange} placeholder="Frequency" required />
            <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" required />
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes" />
            <button type="submit">Submit Prescription</button>
        </form>
    );
}

export default PrescriptionForm;