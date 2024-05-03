const mongoose = require('mongoose');
const Doctor = require('../models/DoctorModel');
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
