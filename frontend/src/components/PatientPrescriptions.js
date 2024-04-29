
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Assuming user context provides patientId

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/patients/${user._id}/prescriptions`);
                // Sort prescriptions from most recent to oldest
                const sortedPrescriptions = response.data.sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued));
                setPrescriptions(sortedPrescriptions);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load prescriptions:', error);
                setLoading(false);
            }
        };

        if (user && user._id) {
            fetchPrescriptions();
        }
    }, [user._id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Your Prescriptions</h1>
            {prescriptions.length > 0 ? (
                <ul>
                    {prescriptions.map((prescription, index) => (
                        <li key={index}>
                            <p>Medicine: {prescription.medicineName}</p>
                            <p>Dosage: {prescription.dosage}</p>
                            <p>Frequency: {prescription.frequency}</p>
                            <p>Duration: {prescription.duration}</p>
                            <p>Notes: {prescription.notes}</p>
                            <p>Issued by: Dr. {prescription.issuedBy}</p>
                            <p>Date issued: {formatDate(prescription.dateIssued)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No prescriptions found.</p>
            )}
        </div>
    );
}

export default PatientPrescriptions;