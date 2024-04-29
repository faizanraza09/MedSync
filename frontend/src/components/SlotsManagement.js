import React, { useEffect, useCallback, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import DoctorNavbar from './DoctorNavbar';

const SlotsManagement = () => {
    const [date, setDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [newSlotTime, setNewSlotTime] = useState('');
    const { user } = useAuth();
    const userId = user._id;

    const fetchSlotsForDate = useCallback(async (selectedDate) => {
        try {
            const formattedDate = selectedDate.toLocaleDateString('en-CA');
            const response = await axios.get(`http://localhost:3001/api/doctors/${userId}/slots/${formattedDate}`);
            const currentDateTime = new Date();
            const filteredSlots = formattedDate === currentDateTime.toLocaleDateString('en-CA') ?
                response.data.times.filter(time => new Date(`${formattedDate}T${time}:00`) > currentDateTime) :
                response.data.times;
            setSlots(filteredSlots || []);
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
            <DoctorNavbar />
            <div className="slot-management-main">
                <div className="calendar-container">
                    <Calendar
                        onChange={onChange}
                        value={date}
                        minDate={new Date()} // Prevent selecting past dates
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
