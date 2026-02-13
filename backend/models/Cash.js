const mongoose = require('mongoose');

const cashHistorySchema = new mongoose.Schema({
    date: { type: String, required: true },
    oldBalance: { type: Number, required: true },
    newBalance: { type: Number, required: true },
    change: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true }
}, { timestamps: true });

const cashSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentBalance: {
        type: Number,
        default: 0
    },
    history: [cashHistorySchema]
}, { timestamps: true });

module.exports = mongoose.models.Cash || mongoose.model('Cash', cashSchema);
