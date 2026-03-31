const mongoose = require('mongoose');

const dueTransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['plus', 'minus', 'initial'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    date: { type: String, required: true }
}, { timestamps: true });

const dueItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    lastUpdate: { type: String, required: true },
    history: [dueTransactionSchema]
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
