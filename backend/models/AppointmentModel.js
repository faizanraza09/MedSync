const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', 
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', 
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  modeOfConsultation: {
    type: String,
    enum: ['In-Person', 'Video'], 
    required: true
  },
  reason: {
    type: String,
    required: true 
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  roomID: {
    type: String,  // Optional field for storing room ID
    default: null
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
