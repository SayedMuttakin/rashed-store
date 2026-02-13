const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get accounts (supports ?service= xxx query param)
// @route   GET /api/accounts
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const serviceType = req.query.service;
        if (!serviceType) {
            return res.status(400).json({ message: 'Service type is required' });
        }
        const accounts = await Account.find({ userId: req.user._id, serviceType });
        res.json(accounts);
    } catch (error) {
        next(error);
    }
});

// @desc    Get accounts by service type (path param)
// @route   GET /api/accounts/:serviceType
// @access  Private
router.get('/:serviceType', protect, async (req, res, next) => {
    try {
        const accounts = await Account.find({ userId: req.user._id, serviceType: req.params.serviceType });
        res.json(accounts);
    } catch (error) {
        next(error);
    }
});

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
router.post('/', protect, async (req, res, next) => {
    const { serviceType, accountName, accountNumber, balance } = req.body;
    try {
        const account = await Account.create({
            userId: req.user._id,
            serviceType,
            accountName,
            accountNumber,
            balance: parseFloat(balance || 0),
            transactions: [{
                date: new Date().toISOString().split('T')[0],
                amount: parseFloat(balance || 0),
                type: 'initial',
                note: 'অ্যাকাউন্ট খোলা হয়েছে'
            }]
        });
        const accounts = await Account.find({ userId: req.user._id, serviceType });
        res.status(201).json(accounts);
    } catch (error) {
        next(error);
    }
});

// @desc    Update account balance
// @route   PUT /api/accounts/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
    const { newBalance, date } = req.body;
    try {
        const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
        if (!account) return res.status(404).json({ message: 'অ্যাকাউন্ট পাওয়া যায়নি' });

        // Ensure values are valid numbers
        const currentBalance = parseFloat(account.balance) || 0;
        const updatedBalance = parseFloat(newBalance);

        // Validate that newBalance is a valid number
        if (isNaN(updatedBalance)) {
            return res.status(400).json({ message: 'অবৈধ ব্যালেন্স মান' });
        }

        const diff = updatedBalance - currentBalance;

        if (diff !== 0) {
            account.transactions.push({
                date: date || new Date().toISOString().split('T')[0],
                amount: Math.abs(diff),
                type: diff > 0 ? 'credit' : 'debit',
                note: 'ব্যালেন্স আপডেট'
            });
            account.balance = updatedBalance;
            await account.save();
        }

        const accounts = await Account.find({ userId: req.user._id, serviceType: account.serviceType });
        res.json(accounts);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
        if (!account) return res.status(404).json({ message: 'অ্যাকাউন্ট পাওয়া যায়নি' });

        const serviceType = account.serviceType;
        await Account.deleteOne({ _id: req.params.id });

        const accounts = await Account.find({ userId: req.user._id, serviceType });
        res.json(accounts);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
