import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'
import DoctorNavbar from './DoctorNavbar';

const DiagnosticsForm = () => {
    const [symptoms, setSymptoms] = useState('');
    const [gender, setGender] = useState('');
    const [yearOfBirth, setYearOfBirth] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSymptomsChange = (e) => {
        setSymptoms(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleYearOfBirthChange = (e) => {
        setYearOfBirth(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResults(null);

        try {
            const response = await axios.post(`http://localhost:3001/api/doctors/diagnostics`, {
                symptoms: symptoms.split(",").map(s => s.trim()), // assuming symptoms are input as comma-separated values
                gender,
                yearOfBirth
            });

            setResults(response.data);
        } catch (err) {
            setError('Failed to fetch diagnostics. Please try again.');
            console.log(err);
        }
    };

    return (
        <div className="diagnostic-container">
            <DoctorNavbar />
            <div className="diagnostic-main">
                <h1>Diagnostics Tool</h1>
                <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="symptoms">Symptoms (comma-separated):</label>
                    <input
                        type="text"
                        id="symptoms"
                        value={symptoms}
                        onChange={handleSymptomsChange}
                    />
                </div>
                <div>
                    <label htmlFor="gender">Gender:</label>
                    <select id="gender" value={gender} onChange={handleGenderChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="yearOfBirth">Year of Birth:</label>
                    <input
                        type="number"
                        id="yearOfBirth"
                        value={yearOfBirth}
                        onChange={handleYearOfBirthChange}
                    />
                </div>
                <button type="submit">Get Diagnostics</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {results && (
                    <div className="result-container">
                        <h2>Results:</h2>
                        {renderDiagnostics(results)}
                    </div>
                )}
            </div>
        </div>
    );
};


const renderDiagnostics = (results) => {
    return results.map((item, index) => (
      <div key={index} className="result-item">
        <h3>{item.Issue.Name} (Accuracy: {item.Issue.Accuracy}%)</h3>
        <p><strong>ICD Codes:</strong> {item.Issue.Icd}</p>
        <p><strong>Description:</strong> {item.Issue.IcdName}</p>
        <p><strong>Professional Name:</strong> {item.Issue.ProfName}</p>
        <h4>Specializations:</h4>
        <ul>
          {item.Specialisation.map((spec, sIndex) => (
            <li key={sIndex}>{spec.Name}</li>
          ))}
        </ul>
      </div>
    ));
  };

            

export default DiagnosticsForm;