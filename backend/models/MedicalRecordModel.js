const mongoose = require('mongoose');
// Assuming Doctor model is defined in '../models/DoctorModel'
const Doctor = require('../models/DoctorModel');
// Assuming Patient model is defined in '../models/PatientModel'
const Patient = require('../models/PatientModel');


const medicalRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    recordFile: {
        type: Buffer,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
