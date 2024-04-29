import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/UploadMedicalRecords.css';
import DoctorNavbar from './DoctorNavbar';


const MedicalRecords = () => {
    const [doctorId, setDoctorId] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const { user} = useAuth();
    const userId = user._id;


    useEffect(() => {
        if (userId) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/records/doctor/details/${userId}`)
                .then(response => {
                    if (response.data && response.data._id) {
                        setDoctorId(response.data._id);
                        console.log("Doctor ID fetched:", response.data._id);
                    } else {
                        console.log("No doctor ID found in response:", response.data);
                    }
                })
                .catch(error => console.error('Error fetching doctor details:', error));
        } else {
            console.log("No userId provided");
        }
    }, [userId]);
    

    // Then fetch patients
    useEffect(() => {
        if (doctorId) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/records/doctor/${doctorId}/patients`)
                .then(response => {
                    setPatients(response.data);
                    console.log("Patients:", response.data);
                })
                .catch(error => console.error('Error fetching patients:', error));
        }
    }, [doctorId]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('recordFile', file);
        formData.append('patientId', selectedPatient);
        formData.append('doctorId', doctorId);

        axios.post(`${process.env.REACT_APP_API_URL}/api/records/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setMessage('File uploaded successfully');
            console.log(response.data);
        })
        .catch(error => {
            setMessage('Upload failed');
            console.error('Error uploading file', error);
        });
    };

    console.log("doctorId:", doctorId);

    return (
        <div className='upload-medical-records-container'>
            <DoctorNavbar />
            <div className="upload-medical-records-content">
                <h2>Upload Medical Records</h2>
                <select onChange={e => setSelectedPatient(e.target.value)} value={selectedPatient}>
                    <option value="">Select a Patient</option>
                    {patients.map(patient => (
                        <option key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName}
                        </option>
                    ))}
                </select>
                <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg"/>
                <button onClick={handleUpload}>Upload</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default MedicalRecords;
