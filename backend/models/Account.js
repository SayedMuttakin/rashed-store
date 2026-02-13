const mongoose = require('mongoose');

const accountTransactionSchema = new mongoose.Schema({
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit', 'initial'], required: true },
    note: { type: String }
}, { timestamps: true });

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['bkash', 'nagad', 'rocket', 'upay', 'bank', 'sim']
    },
    accountName: { type: String }, // For banks (e.g. Dutch-Bangla) or operator names
    accountNumber: { type: String, required: true },
    balance: { type: Number, default: 0 },
    transactions: [accountTransactionSchema]
}, { timestamps: true });

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);
