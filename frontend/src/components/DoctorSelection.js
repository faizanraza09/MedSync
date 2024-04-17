// DoctorSelection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DoctorSelection.css';


const DoctorSelection = ({ onDoctorSelect }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/doctors/');
                setDoctors(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredDoctors = doctors.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm)
    );

    if (loading) return <p>Loading doctors...</p>;

    return (
        <div className="doctor-selection">
            <input
                type="text"
                placeholder="Search doctors..."
                onChange={handleSearchChange}
                className="search-bar"
            />
            {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card" onClick={() => onDoctorSelect(doctor)}>
                    <div>
                        <h3>{doctor.firstName} {doctor.lastName}</h3>
                        <p>{doctor.specialty}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DoctorSelection;
