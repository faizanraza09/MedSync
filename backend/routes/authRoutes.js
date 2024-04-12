const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const passport = require('passport');


const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {

    const { email, password, role, firstName, lastName, phoneNumber, specialty, education } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        user = new User({
            email,
            password: hashedPassword,
            role
        });
        await user.save();

        // Based on role, create either a Doctor or a Patient profile
        if (role === 'doctor') {
            const doctorProfile = new Doctor({
                user: user._id, // Reference to the User model
                firstName,
                lastName,
                phoneNumber,
                specialty,
                education
            });
            await doctorProfile.save();
        } else if (role === 'patient') {
            const patientProfile = new Patient({
                user: user._id, // Reference to the User model
                firstName,
                lastName,
                phoneNumber
                // No specialty and education fields for patients
            });
            await patientProfile.save();
        }

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Handle
router.post('/login', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.status(400).json({ msg: 'No User Exists' });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(200).json({ msg: 'Successfully Authenticated', user });
                console.log(req.user);
            });
        }
    })(req, res, next);
});

module.exports = router;
