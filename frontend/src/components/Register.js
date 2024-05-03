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
    

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { email, password, role, firstName, lastName, phoneNumber, specialty, education } = formData;

    const navigate = useNavigate();

    const checkEmail = async () => {
        if (!email) {
            return true;  
        }
    
        setIsLoading(true);  
    
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/users/check-email`, { email });
            setIsLoading(false); 
            return true;  
        } catch (error) {
            setIsLoading(false);  
            if (error.response && error.response.status === 409) {
                setErrorMessage('Email already exists');
            } else {
                setErrorMessage('Failed to check email. Please try again later.');
            }
            return false;  
        }
    };
    

    const handleBackToHome = () => {
        navigate('/');  
    };

    const handleGoToLogin = () => {
        navigate('/login');  
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        // Check if email is available in system
        const isEmailAvailable = await checkEmail();
        if (!isEmailAvailable) {
            return;  
        }

        // Check for password length
        if (password.length < 8 || password.length > 16) {
            setErrorMessage('Password must be between 8 and 16 characters');
            return;  
        }
      
        const user = {
          email,
          password,
          role,
          firstName,
          lastName,
          phoneNumber,
          ...(role === 'doctor' && { specialty, education })
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
            if (error.response && error.response.status === 409 && error.response.data.message === 'Email already exists') {
            setErrorMessage('Email already exists');
            } else {
            setErrorMessage('An error occurred. Please try again later.');
            }
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
                <button className="auth-button" type="button" onClick={handleGoToLogin}>Already have an Account? Login!</button>
                {/* <button className="auth-button" type="button" onClick={handleBackToHome}>Back to Home</button> */}

            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default Register;