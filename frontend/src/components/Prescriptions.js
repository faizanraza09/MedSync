import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorPrescribe.css';
import DoctorNavbar from './DoctorNavbar';


function Prescriptions() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const { user } = useAuth();
  const doctorId = user._id;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for doctorId:", doctorId);
        const response = await axios.get(`http://localhost:3001/api/doctors/${doctorId}/patients`);
        setAppointments(response.data);
        console.log("Fetched Data:", response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]); //adding doctorId as a dependency

  const handlePrescribe = (patientId) => {
    navigate(`/prescribe/${patientId}`); //navigating to the prescription form
  };

  if (loading) {
    return <p>Loading...</p>; //handling loading state
  }

  return (
    <div>
       <DoctorNavbar />
      <div className="prescriptions-container">
        <div className="prescriptions-main">
          <h1>Prescribe Medication</h1>
          <h3>Select a patient to prescribe medicine for:</h3>
          {appointments.length > 0 ? (
            appointments.map(patient => (
              <div key={patient._id}>
                <ul>
                  <li className="patient" onClick={() => handlePrescribe(patient._id)}>
                    <strong>Patient ID:</strong> {patient._id} <br />
                    <strong>Patient Name:</strong> {patient.firstName} {patient.lastName}
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default Prescriptions;