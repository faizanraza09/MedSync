import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/UploadMedicalRecords.css';
import DoctorNavbar from './DoctorNavbar';

const MedicalRecords = () => {
    const [doctorId, setDoctorId] = useState(null);
    const [patients, setPatients] = useState([]);
    const { user } = useAuth();
    const userId = user._id;

    useEffect(() => {
        if (userId) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/records/doctor/details/${userId}`)
                .then(response => {
                    if (response.data && response.data._id) {
                        setDoctorId(response.data._id);
                    }
                })
                .catch(error => console.error('Error fetching doctor details:', error));
        }
    }, [userId]);

    useEffect(() => {
        if (doctorId) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/records/doctor/${doctorId}/patients`)
                .then(response => {
                    setPatients(response.data);
                })
                .catch(error => console.error('Error fetching patients:', error));
        }
    }, [doctorId]);

    const handleUpload = (patientId, file) => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append('recordFile', file);
        formData.append('patientId', patientId);
        formData.append('doctorId', doctorId);

        axios.post(`${process.env.REACT_APP_API_URL}/api/records/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('File uploaded successfully');
        })
        .catch(error => {
            alert('Upload failed');
            console.error('Error uploading file', error);
        });
    };

    return (
        <div className='upload-medical-records-container'>
            <DoctorNavbar />
            <div className="main-content">
                <h2>Upload Medical Records</h2>
                {patients.map(patient => (
                    <div key={patient._id} className="patient-record">
                        <div className="patient-info">
                            <div className="patient-details">
                                <span className="patient-id"><strong>Patient ID:</strong> {patient._id}</span>
                                <span className="patient-name"><strong>Patient Name:</strong> {patient.firstName} {patient.lastName}</span>
                            </div>
                        </div>
                        <div className="file-upload-actions">
                            <input 
                                type="file" 
                                className="input-file-container"
                                onChange={(e) => handleUpload(patient._id, e.target.files[0])} 
                                accept=".pdf,.jpg,.jpeg"
                            />
                            <button className="upload-button" onClick={() => handleUpload(patient._id)}>Upload</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicalRecords;
