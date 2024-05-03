const express = require('express');
const Doctor = require('../models/DoctorModel'); 
const Appointment = require('../models/AppointmentModel');
const router = express.Router();
const CryptoJS = require('crypto-js');
const {USERNAME, PASSWORD, APIMEDIC_AUTH_URL, APIMEDIC_HEALTH_URL } = process.env;
const axios = require('axios');

const apiKey = USERNAME;
const secretKey = PASSWORD;
const uri = APIMEDIC_AUTH_URL;
const format = "json"; 

const computedHash = CryptoJS.HmacMD5(uri, secretKey);
const computedHashString = computedHash.toString(CryptoJS.enc.Base64);
const authorizationHeader = `Bearer ${apiKey}:${computedHashString}`;

async function getToken() {
    try {
        const token_response = await axios.post(`${uri}?`, {}, {
            headers: {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json'
            }
        })
        return token_response.data.Token;
    } catch (error) {
        console.error('Login failed', error.response ? error.response.data : error.message);
    }
}

// Get a list of all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/dashboard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const doctor = await Doctor.findOne({ userId: userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Get today's date and tomorrow's date in local time zone (e.g., UAE)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + 1); 
        const todayStr = today.toISOString().split('T')[0];  // 'YYYY-MM-DD'
        
        // Fetch appointments for today considering both date and time
        const appointments = await Appointment.find({
            doctorId: doctor._id,
            date: todayStr, 
        }).populate('patientId');


        const dashboardInfo = {
            name: `${doctor.firstName} ${doctor.lastName}`,
            refCode: doctor.refCode,
            appointments: appointments.map(appt => ({
                patientName: `${appt.patientId.firstName} ${appt.patientId.lastName}`,
                date: appt.date,
                time: appt.time,
                reason: appt.reason,
                modeOfConsultation: appt.modeOfConsultation
            }))
        };

        res.json(dashboardInfo);
    } catch (error) {
        console.error('Error fetching doctor dashboard:', error);
        res.status(500).json({ message: 'Error fetching doctor dashboard' });
    }
});



// GET available slots for a doctor on a specific date
router.get('/:userId/slots/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;

        const doctor = await Doctor.findOne({ userId: userId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Find slots for the specific date
        const slot = doctor.availableSlots.find(slot => slot.date === date);
        if (slot) {
            res.json({ times: slot.times });
        } else {
            res.json({ times: [] }); // No slots found for the date
        }
    } catch (error) {
        console.error(`Failed to retrieve slots: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST update or add slots for a doctor
router.post('/:userId/slots', async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, times } = req.body;

        const doctor = await Doctor.findOne({ userId: userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if there's an existing slot for the date
        let slot = doctor.availableSlots.find(s => s.date === date);
        if (slot) {
            // Update existing slot times
            slot.times = times;
        } else {
            // Create new slot entry
            doctor.availableSlots.push({ date, times });
        }

        await doctor.save();
        res.status(201).json({ date, times });
    } catch (error) {
        console.error(`Failed to update slots: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:userId/slots', async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, time } = req.body; // Expecting date and time in the request body

        // Find the doctor by ID and update the document
        const doctor = await Doctor.findOne({ userId: userId });

        // Find the slot for the specific date
        const slotForDate = doctor.availableSlots.find(slot => slot.date === date);

        if (slotForDate) {
            // Remove the time from the times array
            slotForDate.times = slotForDate.times.filter(slotTime => slotTime !== time);

            // Save the updated doctor
            await doctor.save();

            res.status(200).json({ message: 'Slot deleted successfully' });
        } else {
            res.status(404).json({ message: 'Slot not found for the specified date' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slot', error });
    }
});


router.post('/diagnostics', async (req, res) => {
    const { symptoms, gender, yearOfBirth } = req.body;
    const symptomIds = symptoms.join(',');
    console.log(symptomIds)

    try {
        const token = await getToken();
        const health_data = await axios.get(`${APIMEDIC_HEALTH_URL}/diagnosis?token=${token}&language=en-gb&symptoms=[${symptomIds}]&gender=${gender}&year_of_birth=${yearOfBirth}`);

        console.log(health_data.data)
        console.log("GOOD")
        result = health_data.data
        res.status(200).send(result)
    } catch (error) {
        console.error('Health data failed', error.response ? error.response.data : error.message);
    }
});

router.get('/:userId/patients', async (req, res) => {
       
    try {
        const doctor = await Doctor.findOne({ userId: req.params.userId }); //the user id we got was a the doctor user id, we fetch the doctor object from that
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const appointments = await Appointment.find({ doctorId: doctor._id }).populate('patientId');
        //Using a map to extract unique patients
        const uniquePatients = new Map();
        appointments.forEach(appointment => {
            if (appointment.patientId) {
                uniquePatients.set(appointment.patientId._id.toString(), appointment.patientId);
            }
        });

        res.json(Array.from(uniquePatients.values()));
        
        
    } catch (error) {
        res.status(404).json({ message: 'Appointments not found', error });
    }
  });

router.get('/:userId/appointments', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.params.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const appointments = await Appointment.find({ doctorId: doctor._id }).populate('patientId');
        res.json(appointments);
    } catch (error) {
        res.status(404).json({ message: 'Appointments not found', error });
    }
});


module.exports = router;
