import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PatientMedicalRecords.css';
import PatientNavbar from './PatientNavbar';

const PatientMedicalRecords = ({ patientId }) => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/records/patient/${user._id}/records`)
            .then(response => {
                setMedicalRecords(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching medical records:', error);
                setError('Failed to fetch records');
                setIsLoading(false);
            });
    }, [user]);

    const handleFileDownload = (recordId) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/records/file/${recordId}`, {
            responseType: 'blob'  // Important for handling binary data
        })
        .then(response => {
            const filename = response.headers['x-filename'] || 'download';
            const mimeType = response.headers['content-type'] || 'application/octet-stream';
            const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', filename);
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.parentNode.removeChild(fileLink);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='medical-records-container'>
            <PatientNavbar />
            <div className='medical-records-content'>
                <h2>Your Medical Records</h2>
                <ul>
                    {medicalRecords.map(record => (
                        <li key={record._id} className="medical-record-item">
                            <div className="record-info">
                                <span>{record.fileName}</span>
                                <span className="record-date">{new Date(record.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="download-button" onClick={() => handleFileDownload(record._id)}>Download Record</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PatientMedicalRecords;
