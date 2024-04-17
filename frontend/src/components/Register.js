import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'patient',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        specialty: '',
        education: ''
    });

    const { email, password, role, firstName, lastName, phoneNumber, specialty, education } = formData;

    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const user = {
            email, password, role, firstName, lastName, phoneNumber,
            ...(role === 'doctor' && { specialty, education }) // Spread only if the role is 'doctor'
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, user, config);
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Register</h2>
            <form onSubmit={onSubmit}>
                <label className="auth-label" htmlFor="firstName">First Name</label>
                <input className="auth-input" type="text" id="firstName" name="firstName" value={firstName} onChange={onChange} required />

                <label className="auth-label" htmlFor="lastName">Last Name</label>
                <input className="auth-input" type="text" id="lastName" name="lastName" value={lastName} onChange={onChange} required />

                <label className="auth-label" htmlFor="email">Email</label>
                <input className="auth-input" type="email" id="email" name="email" value={email} onChange={onChange} required />

                <label className="auth-label" htmlFor="password">Password</label>
                <input className="auth-input" type="password" id="password" name="password" value={password} onChange={onChange} required />

                <label className="auth-label" htmlFor="phoneNumber">Phone Number</label>
                <input className="auth-input" type="tel" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={onChange} required />

                <label className="auth-label" htmlFor="role">Role</label>
                <select className="auth-input" id="role" name="role" value={role} onChange={onChange}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>

                {role === 'doctor' && (
                    <>
                        <label className="auth-label" htmlFor="specialty">Specialty</label>
                        <input className="auth-input" type="text" id="specialty" name="specialty" value={specialty} onChange={onChange} required />

                        <label className="auth-label" htmlFor="education">Education</label>
                        <input className="auth-input" type="text" id="education" name="education" value={education} onChange={onChange} required />
                    </>
                )}

                <button className="auth-button" type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
