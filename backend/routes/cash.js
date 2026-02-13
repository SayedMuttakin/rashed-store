const express = require('express');
const router = express.Router();
const Cash = require('../models/Cash');
const Account = require('../models/Account');
const Due = require('../models/Due');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get aggregated financial summary (Global Total)
// @route   GET /api/cash/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
    try {
        // 1. Get Liquid Cash
        let cash = await Cash.findOne({ userId: req.user._id });
        const currentCash = cash ? cash.currentBalance : 0;

        // 2. Get Sum of all Accounts (Bank, Mobile Banking, SIM)
        const accounts = await Account.find({ userId: req.user._id });
        const totalAccountsBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

        // 3. Get Sum of all Dues
        const dueDoc = await Due.findOne({ userId: req.user._id });
        const totalDues = dueDoc && Array.isArray(dueDoc.items)
            ? dueDoc.items.reduce((sum, item) => sum + (item.amount || 0), 0)
            : 0;

        const grandTotal = currentCash + totalAccountsBalance + totalDues;

        res.json({
            currentBalance: grandTotal,
            details: {
                cash: currentCash,
                accounts: totalAccountsBalance,
                dues: totalDues
            }
        });
    } catch (error) {
        console.error('Summary Aggregation Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's cash balance and history
// @route   GET /api/cash
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let cash = await Cash.findOne({ userId: req.user._id });

        if (!cash) {
            cash = await Cash.create({ userId: req.user._id, currentBalance: 0, history: [] });
        }

        res.json(cash);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update cash balance
// @route   POST /api/cash
// @access  Private
router.post('/', protect, async (req, res) => {
    const { newBalance, date } = req.body;

    try {
        let cash = await Cash.findOne({ userId: req.user._id });

        if (!cash) {
            cash = new Cash({ userId: req.user._id, currentBalance: 0, history: [] });
        }

        const oldBalance = cash.currentBalance;
        const change = newBalance - oldBalance;

        if (change === 0) {
            return res.status(400).json({ message: 'ব্যালেন্স একই আছে' });
        }

        const newEntry = {
            date: date || new Date().toISOString().split('T')[0],
            oldBalance,
            newBalance,
            change,
            type: change > 0 ? 'credit' : 'debit'
        };

        cash.currentBalance = newBalance;
        cash.history.unshift(newEntry); // Add to the beginning of history

        await cash.save();
        res.status(200).json(cash);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
