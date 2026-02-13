const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/authMiddleware');
const Cash = require('../models/Cash');
const Due = require('../models/Due');
const Account = require('../models/Account');

// Get all settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update settings
router.post('/', protect, async (req, res) => {
    const { headerLogoUrl, appName } = req.body;

    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ headerLogoUrl, appName });
            await settings.save();
        } else {
            if (headerLogoUrl) settings.headerLogoUrl = headerLogoUrl;
            if (appName) settings.appName = appName;
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error('Settings Update Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @desc    Clean financial data (Reset balances and history)
// @route   POST /api/settings/cleanup
// @access  Private (Admin)
router.post('/cleanup', protect, async (req, res) => {
    try {
        console.log('Cleaning financial data requested by admin:', req.user.phone);

        // Reset Cash
        await Cash.updateMany({}, {
            $set: { currentBalance: 0, history: [] }
        });

        // Reset Dues
        await Due.updateMany({}, {
            $set: { items: [] }
        });

        // Reset Accounts
        await Account.updateMany({}, {
            $set: { balance: 0, transactions: [] }
        });

        res.json({ message: 'ডাটাবেস সফলভাবে ক্লিন করা হয়েছে!' });
    } catch (err) {
        console.error('Cleanup Error:', err);
        res.status(500).json({ message: 'ক্লিনআপ করার সময় সমস্যা হয়েছে', error: err.message });
    }
});


module.exports = router;
