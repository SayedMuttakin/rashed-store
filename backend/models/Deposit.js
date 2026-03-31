const mongoose = require('mongoose');

const depositTransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['plus', 'minus', 'initial'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    date: { type: String, required: true }
}, { timestamps: true });

const depositItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    lastUpdate: { type: String, required: true },
    history: [depositTransactionSchema]
}, { timestamps: true });

const depositSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [depositItemSchema]
}, { timestamps: true });

module.exports = mongoose.models.Deposit || mongoose.model('Deposit', depositSchema);
