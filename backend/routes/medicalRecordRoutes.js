const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const Appointment = require('../models/AppointmentModel');
const MedicalRecord = require('../models/MedicalRecordModel');



const storage = multer.memoryStorage();

const upload = multer({ storage: storage });



// Get doctor details by userId
router.get('/doctor/details/:userId', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.params.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/doctor/:doctorId/patients', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        // First, find distinct patient IDs from the appointments
        const patientIds = await Appointment.distinct('patientId', { doctorId: doctorId });

        // Then, fetch details for these patient IDs
        const patients = await Patient.find({
            '_id': { $in: patientIds }
        });

        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload a medical record
router.post('/upload', upload.single('recordFile'), async (req, res) => {
    const { patientId, doctorId } = req.body;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        // Create new medical record document
        const newRecord = new MedicalRecord({
            patientId,
            doctorId,
            recordFile: req.file.buffer,
            mimeType: req.file.mimetype,
            fileName: req.file.originalname
        });
        const savedRecord = await newRecord.save();

        // Add reference to this record in the patient's document
        await Patient.findByIdAndUpdate(patientId, {
            $push: { medicalRecords: savedRecord._id }
        });

        res.status(201).json({ message: 'Record saved successfully', recordId: savedRecord._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/patient/:userId/records', async (req, res) => {
    try {
        const userId = req.params.userId;
        const patient = await Patient.findOne({userId:userId}).populate('medicalRecords');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient.medicalRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/file/:recordId', async (req, res) => {
    try {
        const recordId = req.params.recordId;
        const record = await MedicalRecord.findById(recordId);
        if (!record) {
            return res.status(404).send('Record not found');
        }

        res.setHeader('Content-Type', record.mimeType);
        res.setHeader('X-Filename', record.fileName);
        
        res.send(record.recordFile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving the record');
    }
});



module.exports = router;
