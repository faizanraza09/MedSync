// DoctorSelection.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/DoctorSelection.css';

const DoctorSelection = ({ onDoctorSelect, user }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('All Specialties');
    const [specialties, setSpecialties] = useState([]);

    const fetchAvailableDoctors = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patients/available-doctors/${user._id}`);
            setDoctors(response.data);
            const fetchedSpecialties = [...new Set(response.data.map(doc => doc.specialty))];
            setSpecialties(['All Specialties', ...fetchedSpecialties]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    }, [user._id]);

    useEffect(() => {
        fetchAvailableDoctors();
    }, [fetchAvailableDoctors]);

    const handleReferralCodeSubmit = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/patients/add-doctor/${user._id}`, { referralCode });
            if (response.data.message === "Doctor already added") {
                alert('Doctor already added');
            } else {
                alert('Doctor added successfully');
            }
            fetchAvailableDoctors(); // Refresh the list of available doctors
        } catch (error) {
            console.error('Error adding doctor:', error.response.data.message);
            alert(error.response.data.message || 'Failed to add doctor');
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleSpecialtyChange = (event) => {
        setSpecialtyFilter(event.target.value);
    };

    const filteredDoctors = doctors.filter(doctor => {
        const nameMatch = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm);
        const specialtyMatch = specialtyFilter === 'All Specialties' || doctor.specialty === specialtyFilter;
        return nameMatch && specialtyMatch;
    });

    if (loading) return <p>Loading doctors...</p>;

    return (
        <div className="doctor-selection">
            <input
                type="text"
                placeholder="Search doctors..."
                onChange={handleSearchChange}
                className="search-bar"
            />
            <select onChange={handleSpecialtyChange} className="specialty-filter">
                {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Enter referral code..."
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="referral-code-input"
            />
            <button onClick={handleReferralCodeSubmit} className="add-doctor-button">Add Doctor</button>
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

