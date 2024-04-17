const express = require('express');
const Doctor = require('../models/DoctorModel'); // Assuming you have a Doctor model defined
const router = express.Router();

// Get a list of all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET available slots for a doctor on a specific date
router.get('/:userId/slots/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;

        const doctor = await Doctor.findOne({ userId: userId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Find slots for the specific date
        const slot = doctor.availableSlots.find(slot => slot.date === date);
        if (slot) {
            res.json({ times: slot.times });
        } else {
            res.json({ times: [] }); // No slots found for the date
        }
    } catch (error) {
        console.error(`Failed to retrieve slots: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST update or add slots for a doctor
router.post('/:userId/slots', async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, times } = req.body;

        const doctor = await Doctor.findOne({ userId: userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if there's an existing slot for the date
        let slot = doctor.availableSlots.find(s => s.date === date);
        if (slot) {
            // Update existing slot times
            slot.times = times;
        } else {
            // Create new slot entry
            doctor.availableSlots.push({ date, times });
        }

        await doctor.save();
        res.status(201).json({ date, times });
    } catch (error) {
        console.error(`Failed to update slots: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:userId/slots', async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, time } = req.body; // Expecting date and time in the request body

        // Find the doctor by ID and update the document
        const doctor = await Doctor.findOne({ userId: userId });

        // Find the slot for the specific date
        const slotForDate = doctor.availableSlots.find(slot => slot.date === date);

        if (slotForDate) {
            // Remove the time from the times array
            slotForDate.times = slotForDate.times.filter(slotTime => slotTime !== time);

            // Save the updated doctor
            await doctor.save();

            res.status(200).json({ message: 'Slot deleted successfully' });
        } else {
            res.status(404).json({ message: 'Slot not found for the specified date' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slot', error });
    }
});



module.exports = router;
