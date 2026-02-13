const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: ['https://rashed-store-81kh.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Rashed Store API is running...' });
});

// Import Routes
const authRoutes = require('../routes/auth');
const cashRoutes = require('../routes/cash');
const dueRoutes = require('../routes/dues');
const accountRoutes = require('../routes/accounts');

app.use('/api/auth', authRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/cash-balance', cashRoutes); // Home screen endpoint
app.use('/api/dues', dueRoutes);
app.use('/api/accounts', accountRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
