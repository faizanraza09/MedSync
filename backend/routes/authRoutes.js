const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const passport = require('passport');
const router = express.Router();

const generateRefCode = (firstName, lastName) => {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
    return `${initials}${randomNumber}`;
};

router.post('/register', async (req, res) => {
    const { email, password, role, firstName, lastName, phoneNumber, specialty, education } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            role
        });
        await user.save();

        if (role === 'doctor') {
            const refCode = generateRefCode(firstName, lastName);
            const doctorProfile = new Doctor({
                userId: user._id,
                firstName,
                lastName,
                phoneNumber,
                specialty,
                education,
                refCode,
                availableSlots: []
            });
            await doctorProfile.save();
        } else {
            const patientProfile = new Patient({
                userId: user._id,
                firstName,
                lastName,
                phoneNumber
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
        if (err) return next(err);
        if (!user) return res.status(400).json(info);
        req.logIn(user, err => {
            if (err) return next(err);
            return res.status(200).json({ message: 'Logged in successfully', user });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {

        const user = await User.findOne({ email });

        if (user) {
            res.status(409).json({ message: 'Email already exists' });
        } else {
            res.json({ message: 'Email is available' });
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/check-email-exists', async (req, res) => {
    const { email } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.json({ exists: true });
        } else {
            res.status(404).json({ exists: false, message: 'Email does not exist' });
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});


module.exports = router;