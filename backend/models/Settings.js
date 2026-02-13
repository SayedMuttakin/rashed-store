const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    headerLogoUrl: {
        type: String,
        default: '/app-logo/logo.png'
    },
    appName: {
        type: String,
        default: 'Rashed Store'
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
