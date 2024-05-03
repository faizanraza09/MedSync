import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../styles/Dashboard.css';
import '../styles/DiagnosticsForm.css';
import DoctorNavbar from './DoctorNavbar';


const DiagnosticsForm = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [symptomsOptions, setSymptomsOptions] = useState([]);
    const [gender, setGender] = useState('');
    const [yearOfBirth, setYearOfBirth] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const response = await fetch('sorted_symptoms.json');
                const data = await response.json();
                const options = data.map(symptom => ({
                    value: symptom.ID,
                    label: symptom.Name
                }));
                setSymptomsOptions(options);
            } catch (error) {
                console.error('Failed to load symptoms data:', error);
            }
        };

        fetchSymptoms();
    }, []);

    const handleSelectChange = (selectedOptions) => {
        if (selectedOptions.length <= 5) {
            setSymptoms(selectedOptions);
        } else {
            // Show an error message or prevent the additional selection
            console.log("Maximum of 5 symptoms allowed.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleYearOfBirthChange = (e) => {
        setYearOfBirth(e.target.value);
    };

    const isGenderSelected = () => {
        return gender !== '';
    };

    const isYearOfBirthSelected = () => {
        return yearOfBirth !== '';
    };

    const isSymptomsSelected = () => {
        return symptoms.length > 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResults(null);

        if (!isGenderSelected()) {
            setError('Please select a gender.');
            return;
        }

        if (!isYearOfBirthSelected()) {
            setError('Please select a year of birth.');
            return;
        }

        if (!isSymptomsSelected()) {
            setError('Please select at least one symptom.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3001/api/doctors/diagnostics`, {
                symptoms: symptoms.map(s => s.value),
                gender,
                yearOfBirth
            });

            setResults(response.data);
        } catch (err) {
            setError('Failed to fetch diagnostics. Please try again.');
            console.error(err);
        }
    };





    return (
        <div className="diagnostic-container">
            <DoctorNavbar />
            <div className="diagnostic-main">
                <h1>Intelligent Diagnostics Tool</h1>
                <form className='diagnostics-form' onSubmit={handleSubmit}>
                    <div>
                        <Select
                            id="symptoms"
                            isMulti
                            value={symptoms}
                            onChange={handleSelectChange}
                            options={symptomsOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Symptoms"
                        />
                    </div>
                    <Select
                        id="gender"
                        value={gender ? { value: gender, label: gender } : null}
                        onChange={(option) => setGender(option ? option.value : '')}
                        options={[
                            { value: '', label: 'Select Gender' }, // Default placeholder option
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                        ]}
                        placeholder="Select Gender"
                        isSearchable={false}
                        components={{
                            IndicatorSeparator: () => null,
                        }}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                            }),
                        }}
                    />
                    <Select
                        id="yearOfBirth"
                        value={yearOfBirth ? { value: yearOfBirth, label: yearOfBirth } : null}
                        onChange={(option) => setYearOfBirth(option ? option.value : '')}
                        options={Array.from({ length: 118 }, (_, i) => ({
                            value: (2024 - i).toString(),
                            label: (2024 - i).toString(),
                        }))}
                        placeholder="Year of Birth"
                        isSearchable={true}
                        components={{
                            IndicatorSeparator: () => null,
                        }}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                            }),
                        }}
                    />
                    <button className='diagnostic_button' type="submit">Get Diagnostics</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {results && (
                    <div className="result-container">
                        {renderDiagnostics(results)}
                    </div>
                )}
            </div>
        </div>
    );
};

const renderDiagnostics = (results) => {
    if (results.length === 0) {
        return <p>No diagnosis available for these set of symptoms.</p>;
    }
    return results.slice(0, 3).map((item, index) => (
        <div key={index} className="result-item">
            <h3>{item.Issue.Name} (Accuracy: {item.Issue.Accuracy.toFixed(2)}%)</h3>
            <p><strong>ICD Codes:</strong> {item.Issue.Icd}</p>
            <p><strong>Description:</strong></p>
            <ul>
                {item.Issue.IcdName.split(';').map((desc, dIndex) => (
                    desc.trim() ? <li key={dIndex}>{desc.trim()}</li> : null
                ))}
            </ul>
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