import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import '../styles/Dashboard.css';

const SlotsManagement = () => {
    const [date, setDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [newSlotTime, setNewSlotTime] = useState('');
    const { user, logout } = useAuth();
    const userId = user._id;

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const fetchSlotsForDate = useCallback(async (selectedDate, changed = false) => {
        try {
            if (!changed) {
                selectedDate = selectedDate.toLocaleDateString('en-CA')
            }
            const response = await axios.get(`http://localhost:3001/api/doctors/${userId}/slots/${selectedDate}`);
            setSlots(response.data.times || []);
        } catch (error) {
            console.error('Error fetching slots', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchSlotsForDate(date);
    }, [date, fetchSlotsForDate]);

    const onChange = newDate => {
        setDate(newDate);
    };

    const handleAddSlot = useCallback(async () => {
        if (!newSlotTime) {
            alert('Please enter a valid time.');
            return;
        }
        try {
            const formattedDate = date.toLocaleDateString('en-CA');
            const response = await axios.post(`http://localhost:3001/api/doctors/${userId}/slots`, {
                date: formattedDate,
                times: [...slots, newSlotTime]
            });
            setSlots(response.data.times);
            setNewSlotTime('');
        } catch (error) {
            console.error('Error adding new slot', error);
        }
    }, [date, slots, newSlotTime, userId]);

    const handleDeleteSlot = useCallback(async (slotDate, time) => {
        if (!window.confirm(`Are you sure you want to delete the slot at ${time} on ${slotDate}?`)) return;

        try {
            await axios.delete(`http://localhost:3001/api/doctors/${userId}/slots`, {
                data: { date: slotDate, time }
            });
            fetchSlotsForDate(date);
        } catch (error) {
            console.error('Error deleting slot', error);
        }
    }, [userId, date, fetchSlotsForDate]);



    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo-section">
                    <i className="fas fa-user-md"></i>
                    <h2>MedSync</h2>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><i className="fas fa-tachometer-alt"></i> Dashboard</li>
                        <li onClick={() => navigate('/manage-slots')}><i className="fas fa-clock"></i> Manage Slots</li>
                        <li><i className="fas fa-users"></i> My Patients</li>
                        <li><i className="fas fa-calendar-check"></i> Appointments</li>
                        <li><i className="fas fa-notes-medical"></i> Medical Records</li>
                        <li><i className="fas fa-comment-medical"></i> Consultations</li>
                        <li><i className="fas fa-cog"></i> Settings</li>
                    </ul>
                </nav>
                <div className="logout-section">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <div className="slot-management-main">
                <div className="calendar-container">
                    <Calendar
                        onChange={onChange}
                        value={date}
                        maxDetail="month"
                    />
                </div>
                <div className="slot-container">
                    <h4>Available Slots on {date.toLocaleDateString('en-CA')}:</h4>
                    <ul className="slot-list">
                        {slots.map((time, index) => (
                            <li key={index} className="slot-item">
                                {time}
                                <button onClick={() => handleDeleteSlot(date.toLocaleDateString('en-CA'), time)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <div className="add-slot-container">
                        <input
                            type="time"
                            value={newSlotTime}
                            onChange={e => setNewSlotTime(e.target.value)}
                            placeholder="HH:MM"
                            className="time-input"
                        />
                        <button onClick={handleAddSlot} className="add-slot-button">Add New Slot</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotsManagement;
