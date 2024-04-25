const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    availableDoctors : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]
});

module.exports = mongoose.model('Patient', patientSchema);
