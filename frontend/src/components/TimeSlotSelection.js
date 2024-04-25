import React, { useEffect, useCallback, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../styles/TimeSlotSelection.css';

const TimeSlotSelection = ({ selectedDoctor, selectedDate, onDateChange, onTimeSlotSelect }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = selectedDoctor.userId;

    const fetchSlots = useCallback(async () => {
        setLoading(true);
        try {
            const formattedDate = selectedDate.toLocaleDateString('en-CA');
            const response = await axios.get(`http://localhost:3001/api/doctors/${userId}/slots/${formattedDate}`);
            // Filter slots for the current date to exclude past times
            const currentDateTime = new Date();
            let filteredSlots = response.data.times || [];
            if (formattedDate === currentDateTime.toLocaleDateString('en-CA')) {
                filteredSlots = filteredSlots.filter(slot => {
                    const slotTime = new Date(`${formattedDate} ${slot}`);
                    return slotTime > currentDateTime;
                });
            }
            setSlots(filteredSlots);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    }, [userId, selectedDate]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    // Inside your TimeSlotSelection component
    return (
        <div className="time-slot-selection-container">
            <div className="time-slot-selection">
                <h2>Select a Time Slot</h2>
                <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    maxDetail="month"
                    minDate={new Date()}  
                />
            </div>
            <div className="slots-list-container">
                <h4>Available Slots on {selectedDate.toLocaleDateString('en-CA')}:</h4>
                {loading ? (
                    <p>Loading slots...</p>
                ) : (
                    <div className="slots-list">
                        {slots.length > 0 ? (
                            slots.map((slot, index) => (
                                <button key={index} onClick={() => onTimeSlotSelect(slot)}>
                                    {slot}
                                </button>
                            ))
                        ) : (
                            <p>No available slots for this date.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeSlotSelection;
