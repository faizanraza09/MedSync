import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Prescriptions.css'; // Ensure this is the path to your CSS file
import PatientNavbar from './PatientNavbar';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (user && user._id) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patients/${user._id}/prescriptions`);
                    const sortedPrescriptions = response.data.sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued));
                    setPrescriptions(sortedPrescriptions);
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to load prescriptions:', error);
                    setLoading(false);
                }
            }
        };
        fetchPrescriptions();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <PatientNavbar />
            <div className="user-prescriptions-container">
                <div className="user-prescriptions-main">
                    <h1 className="user-prescriptions-title">Your Prescriptions</h1>
                    {prescriptions.length > 0 ? (
                        <ul className="user-prescriptions-list">
                            {prescriptions.map((prescription, index) => (
                                <li key={index}>
                                    <p><strong>Medicine:</strong> {prescription.medicineName}</p>
                                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                                    <p><strong>Duration:</strong> {prescription.duration}</p>
                                    <p><strong>Notes:</strong> {prescription.notes}</p>
                                    <p><strong>Issued by:</strong> Dr. {prescription.issuedBy}</p>
                                    <p><strong>Date issued:</strong> {formatDate(prescription.dateIssued)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="user-prescriptions-no-data">No prescriptions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatientPrescriptions;
