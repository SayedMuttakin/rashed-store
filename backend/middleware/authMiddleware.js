const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rashed_store_secret_key_2026');

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'ইউজার পাওয়া যায়নি, দয়া করে আবার লগইন করুন' });
            }

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return res.status(401).json({ message: 'অথরাইজেশন ব্যর্থ হয়েছে, টোকেন সঠিক নয়' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'কোন টোকেন পাওয়া যায়নি, লগইন করুন' });
    }
};

module.exports = { protect };
