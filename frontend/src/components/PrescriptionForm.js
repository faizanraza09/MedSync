import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DoctorNavbar from './DoctorNavbar';
import Select from 'react-select';
import '../styles/Prescriptions.css';
import axios from 'axios';

function PrescriptionForm() {
    const { user } = useAuth();
    const userId = user._id;
    console.log("Doctor issuing ID ", userId);

    const [formData, setFormData] = useState({
        medicineName: '',
        dosage: '',
        dosageUnit: { value: ' ', label: ' ' }, // default unit
        frequency: '',
        frequencyUnit: { value: ' ', label: ' ' }, // default unit
        duration: '',
        durationUnit: { value: ' ', label: ' ' }, // default unit
        notes: '',
        doctorId: userId
    });

    const { patientId } = useParams();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        setFormData({ ...formData, [actionMeta.name]: selectedOption });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check all inputs, including select inputs, to ensure they are not empty or just a placeholder
        if (!formData.medicineName || !formData.dosage || !formData.frequency || !formData.duration ||
            formData.dosageUnit.value === " " || // Corrected comparison
            formData.frequencyUnit.value === " " || // Corrected comparison
            formData.durationUnit.value === " ") { // Corrected comparison
            alert('Please fill in all required fields.');
            return; // Stop the form submission if any field is not properly filled
        }

        if (formData.dosage <= 0 || formData.dosage > "2000" || !Number.isInteger(Number(formData.dosage))) {
            alert('Please put an appropriate dosage amount!');
            return;
        }

        if (formData.frequency <= 0 || !Number.isInteger(Number(formData.frequency))) {
            console.log()
            alert('Please put an appropriate frequency of intake amount!');
            return;
        }

        if (formData.duration <= 0 || !Number.isInteger(Number(formData.duration))) {
            alert('Please put an appropriate duration length!');
            return;
        }

        // If validation passes, proceed to submit the form
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/patients/${patientId}/prescribe`, formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to add prescription:', error);
            alert('Failed to add prescription');
        }
    };

    if (isSubmitted) {
        return (
            <div>
                <DoctorNavbar />
                <div className="prescriptions-container">
                    <div className="prescriptions-main">
                        <h2>Prescription Added Successfully!</h2>
                        <p>Your prescription has been successfully submitted.</p>
                        <button onClick={() => navigate('/doctor-dashboard')}>Back to dashboard</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <DoctorNavbar />
            <div className="prescriptions-container">
                <div className="prescriptions-main">
                    <form onSubmit={handleSubmit}>
                        <h1>Prescribe Medication</h1>
                        <div className="form-group">
                            <input
                                name="medicineName"
                                value={formData.medicineName}
                                onChange={handleChange}
                                placeholder="Medicine Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                placeholder="Dosage"
                                required
                            />
                            <Select
                                name="dosageUnit"
                                value={formData.dosageUnit}
                                onChange={handleSelectChange}
                                options={[
                                    { value: 'mg', label: 'mg' },
                                    { value: 'pill', label: 'Pill' },
                                    { value: 'ml', label: 'ml' },
                                    { value: 'droplet', label: 'Droplet' }
                                ]}
                                placeholder=""
                                required
                                className="select-container"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                placeholder="Frequency"
                                required
                            />
                            <Select
                                name="frequencyUnit"
                                value={formData.frequencyUnit}
                                onChange={handleSelectChange}
                                options={[
                                    { value: 'hour', label: 'Hour' },
                                    { value: 'day', label: 'Day' },
                                    { value: 'week', label: 'Week' },
                                    { value: 'month', label: 'Month' }
                                ]}
                                required
                                placeholder=""
                                className="select-container"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Duration"
                                required
                            />
                            <Select
                                name="durationUnit"
                                value={formData.durationUnit}
                                onChange={handleSelectChange}
                                options={[
                                    { value: 'days', label: 'Days' },
                                    { value: 'weeks', label: 'Weeks' },
                                    { value: 'months', label: 'Months' },
                                    { value: 'years', label: 'Years' }
                                ]}
                                required
                                placeholder=""
                                className="select-container"
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Additional notes"
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit">Submit Prescription</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PrescriptionForm;