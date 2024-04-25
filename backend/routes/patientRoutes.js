const express = require('express');
const Appointment = require('../models/AppointmentModel');
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const router = express.Router();



router.post('/add-doctor/:userId', async (req, res) => {
    const { referralCode } = req.body;
    const userId = req.params.userId;

    try {
        // Find the doctor by the referral code
        const doctor = await Doctor.findOne({ refCode: referralCode });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Find the patient and add the doctor to their list of available doctors
        const patient = await Patient.findOne({userId: userId});
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Add the doctor's ID to the patient's availableDoctors array
        if (!patient.availableDoctors.includes(doctor._id)) {
            patient.availableDoctors.push(doctor._id);
            await patient.save();
        }

        res.status(200).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a list of doctors available to a specific patient
router.get('/available-doctors/:userId', async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.params.userId }).populate('availableDoctors');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.json(patient.availableDoctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Post an appointment
router.post('/book', async (req, res) => {
    const { doctorId, userId, date, time, modeOfConsultation, reason } = req.body;
    
    try {
        // Fetch the patient using the userId
        const patient = await Patient.findOne({ userId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Create and save the appointment
        const newAppointment = new Appointment({
            doctorId,
            patientId: patient._id,
            date,
            time,
            modeOfConsultation,
            reason
        });
        await newAppointment.save();

        // Find the doctor and remove the slot from the availableSlots array
        await Doctor.updateOne(
            { _id: doctorId, 'availableSlots.date': date },
            { $pull: { 'availableSlots.$.times': time } }
        );

        res.status(201).json({ message: "Appointment booked successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:userId/appointments', async (req, res) => {
    try {
        const userId = req.params.userId;
        const patient = await Patient.findOne({ userId: userId });
        const patientId = patient._id;
        const appointments = await Appointment.find({ patientId: patientId });

        const appointmentsWithDoctors = await Promise.all(appointments.map(async (appointment) => {
            const doctor = await Doctor.findOne({ _id: appointment.doctorId });
            return {
                ...appointment._doc,
                doctor: doctor.firstName + ' ' + doctor.lastName
            };
        }));

        console.log(appointmentsWithDoctors);
        res.json(appointmentsWithDoctors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;