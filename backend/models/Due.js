const mongoose = require('mongoose');

const dueItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    lastUpdate: { type: String, required: true }
}, { timestamps: true });

const dueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [dueItemSchema]
}, { timestamps: true });

module.exports = mongoose.models.Due || mongoose.model('Due', dueSchema);
