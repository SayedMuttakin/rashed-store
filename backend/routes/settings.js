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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
