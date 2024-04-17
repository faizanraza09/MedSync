const express = require('express');
const Appointment = require('../models/AppointmentModel');
const Patient = require('../models/PatientModel');
const router = express.Router();

// Post an appointment
router.post('/book', async (req, res) => {

    const { doctorId, userId, date, time, modeOfConsultation, reason } = req.body;
    const patient = await Patient.findOne({ userId: userId });
    try {
        const newAppointment = new Appointment({
            doctorId: doctorId,
            patientId: patient._id,
            date,
            time,
            modeOfConsultation,
            reason,
        });
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;