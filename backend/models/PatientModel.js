const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String,
    dateIssued: { type: Date, default: Date.now },
    issuedBy : String
});


const patientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    availableDoctors : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    medicalRecords : [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }],
    prescriptions: [prescriptionSchema]
});

module.exports = mongoose.model('Patient', patientSchema);
