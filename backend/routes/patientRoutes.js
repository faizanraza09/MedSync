const express = require('express');
const Appointment = require('../models/AppointmentModel');
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

function randomID() {
    return uuidv4(); // Generates a unique UUID
}

// Get patient details by userId
router.get('/details/:userId', async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.params.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({
            firstName: patient.firstName,
            lastName: patient.lastName
            // you can add more details here if needed
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/add-doctor/:userId', async (req, res) => {
    const { referralCode } = req.body;
    const userId = req.params.userId;

    try {
        // Find the doctor by the referral code
        const doctor = await Doctor.findOne({ refCode: referralCode });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Find the patient and check if the doctor is already added to their list of available doctors
        const patient = await Patient.findOne({ userId: userId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if the doctor's ID is already in the patient's availableDoctors array
        if (patient.availableDoctors.includes(doctor._id)) {
            return res.status(200).json({ message: "Doctor already added" });
        }

        // Add the doctor's ID to the patient's availableDoctors array
        patient.availableDoctors.push(doctor._id);
        await patient.save();

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
    let roomID = null;
    if (modeOfConsultation === 'Video') {
        roomID = randomID();
    }
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
            reason,
            roomID
        });
        await newAppointment.save();

        // Find the doctor and remove the slot from the availableSlots array
        await Doctor.updateOne(
            { _id: doctorId, 'availableSlots.date': date },
            { $pull: { 'availableSlots.$.times': time } }
        );

        // Populate the doctor in the appointment object
        const populatedAppointment = await newAppointment.populate('doctorId');
        console.log(populatedAppointment);
        res.status(201).json({ message: "Appointment booked successfully", appointment: populatedAppointment });
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


router.post('/:patientId/prescribe', async (req, res) => {
    try {
        const {
            medicineName,
            dosage, dosageUnit, // assuming dosageUnit might be an object
            frequency, frequencyUnit, // assuming frequencyUnit might be an object
            duration, durationUnit, // assuming durationUnit might be an object
            notes, doctorId
        } = req.body;

        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const doctor = await Doctor.findOne({ userId: doctorId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const issuedBy = `${doctor.firstName} ${doctor.lastName}`;

        // Ensure units are extracted as strings
        const fullDosage = `${dosage} ${dosageUnit.value || dosageUnit}`;
        const fullFrequency = `${frequency} per ${frequencyUnit.value || frequencyUnit}`;
        const fullDuration = `${duration} ${durationUnit.value || durationUnit}`;

        // Add the concatenated data to the prescription list
        patient.prescriptions.push({
            medicineName,
            dosage: fullDosage,
            frequency: fullFrequency,
            duration: fullDuration,
            notes,
            issuedBy
        });

        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        console.error('Error adding prescription:', error);
        res.status(500).json({ message: 'Error adding prescription', error });
    }
});

//Geting prescriptions for a patient by their ID
router.get('/:patientId/prescriptions', async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.params.patientId });
        if (!patient) {
            return res.status(404).send('Patient not found');
        }
        res.json(patient.prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Error fetching prescriptions', error });
    }
});
module.exports = router;