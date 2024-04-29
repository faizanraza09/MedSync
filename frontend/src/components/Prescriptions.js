import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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
      <h1>Patients</h1>
      {appointments.length > 0 ? (
        appointments.map(patient => (
          <div key={patient._id}>
            <p>{patient.firstName} {patient.lastName}</p>
            <button onClick={() => handlePrescribe(patient._id)}>Prescribe Medication</button>
          </div>
        ))
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default Prescriptions;