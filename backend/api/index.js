const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();

// Initial connection - but we will also ensure it's connected in routes/middleware
connectDB().catch(err => console.error('Initial DB connection error:', err));

// Middleware
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://rashed-store-delta.vercel.app',
            'https://rashed-store.vercel.app'
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            const error = new Error('CORS blocked this request');
            error.status = 403;
            callback(error);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Rashed Store API is running...' });
});

// Import Routes
const authRoutes = require('../routes/auth');
const cashRoutes = require('../routes/cash');
const dueRoutes = require('../routes/dues');
const accountRoutes = require('../routes/accounts');
const settingsRoutes = require('../routes/settings');

app.use('/api/auth', authRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/cash-balance', cashRoutes); // Home screen endpoint
app.use('/api/dues', dueRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Final Error Catch:', err);
    const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
    res.status(statusCode).json({
        message: err.message || 'সার্ভারে সমস্যা হয়েছে',
        debug_error: err.message, // Temporarily show error message for debugging
        debug_stack: err.stack,     // Temporarily show stack for debugging
    });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
