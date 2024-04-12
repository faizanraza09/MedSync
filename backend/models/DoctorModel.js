const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    specialty: { type: String, required: true },
    education: { type: String, required: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);
