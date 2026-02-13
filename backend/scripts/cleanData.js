const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Cash = require('../models/Cash');
const Due = require('../models/Due');
const Account = require('../models/Account');
require('dotenv').config();

const cleanData = async () => {
    try {
        await connectDB();

        console.log('Cleaning financial data...');

        // Reset Cash
        await Cash.updateMany({}, {
            $set: { currentBalance: 0, history: [] }
        });
        console.log('✓ Cash data reset');

        // Reset Dues
        await Due.updateMany({}, {
            $set: { items: [] }
        });
        console.log('✓ Dues data cleared');

        // Reset Accounts
        await Account.updateMany({}, {
            $set: { balance: 0, transactions: [] }
        });
        console.log('✓ Accounts data reset');

        console.log('Database cleaning completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    }
};

cleanData();
