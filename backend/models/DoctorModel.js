const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    date: String, // YYYY-MM-DD format
    times: [String] // Array of times, e.g., ['09:00', '10:00', '11:00']
});

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    specialty: { type: String, required: true },
    education: { type: String, required: true },
    refCode: { type: String, required: true },
    availableSlots: [SlotSchema]
});

module.exports = mongoose.model('Doctor', doctorSchema);
