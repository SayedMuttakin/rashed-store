const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
    const { name, phone, password } = req.body;

    try {
        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ message: 'এই নম্বর দিয়ে ইতিমধ্যেই অ্যাকাউন্ট খোলা হয়েছে' });
        }

        const user = await User.create({
            name,
            phone,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'ভুল তথ্য দেওয়া হয়েছে' });
        }
    } catch (error) {
        next(error);
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'ভুল মোবাইল নম্বর অথবা পাসওয়ার্ড' });
        }
    } catch (error) {
        next(error);
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'rashed_store_secret_key_2026', {
        expiresIn: '30d',
    });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                isAdmin: user.isAdmin
            });
        } else {
            res.status(404).json({ message: 'ইউজার পাওয়া যায়নি' });
        }
    } catch (error) {
        next(error);
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;

            // Check if phone number is being changed and if it's already taken
            if (req.body.phone && req.body.phone !== user.phone) {
                const phoneExists = await User.findOne({ phone: req.body.phone });
                if (phoneExists) {
                    return res.status(400).json({ message: 'এই মোবাইল নম্বরটি ইতিমধ্যেই অন্য কোনো অ্যাকাউন্টে ব্যবহার করা হচ্ছে' });
                }
                user.phone = req.body.phone;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                phone: updatedUser.phone,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'ইউজার পাওয়া যায়নি' });
        }
    } catch (error) {
        console.error('Profile Update Error:', error);

        // Handle Mongoose/MongoDB specific errors
        if (error.code === 11000) {
            return res.status(400).json({ message: 'এই মোবাইল নম্বরটি ইতিমধ্যেই ব্যবহার করা হচ্ছে' });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({
            message: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।',
            error: error.message
        });
    }
});

module.exports = router;
