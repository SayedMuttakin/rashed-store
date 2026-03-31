const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's deposit list
// @route   GET /api/deposits
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        let deposit = await Deposit.findOne({ userId: req.user._id });
        if (!deposit) {
            deposit = await Deposit.create({ userId: req.user._id, items: [] });
        }
        res.json(deposit.items);
    } catch (error) {
        next(error);
    }
});

// @desc    Add new deposit item
router.post('/', protect, async (req, res, next) => {
    const { name, amount, description } = req.body;
    try {
        let deposit = await Deposit.findOne({ userId: req.user._id });
        if (!deposit) {
            deposit = new Deposit({ userId: req.user._id, items: [] });
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const newItem = {
            name,
            amount: parseFloat(amount),
            lastUpdate: dateStr,
            history: [{
                type: 'initial',
                amount: parseFloat(amount),
                description: description || 'প্রাথমিক এন্ট্রি',
                date: dateStr
            }]
        };

        deposit.items.push(newItem);
        await deposit.save();
        res.status(201).json(deposit.items);
    } catch (error) {
        next(error);
    }
});

// @desc    Update deposit item amount
router.put('/:id', protect, async (req, res, next) => {
    const { amount, description, transactionType } = req.body;
    try {
        const deposit = await Deposit.findOne({ userId: req.user._id });
        if (!deposit) return res.status(404).json({ message: 'তথ্য পাওয়া যায়নি' });

        const item = deposit.items.id(req.params.id);
        if (!item) return res.status(404).json({ message: 'ব্যক্তি খুঁজে পাওয়া যায়নি' });

        const delta = parseFloat(amount);
        const type = transactionType || (delta > 0 ? 'plus' : 'minus');
        const dateStr = new Date().toISOString().split('T')[0];

        // For deposits: plus means "Gave more deposit" (Received by user), minus means "Withdrawal" (Returned by user)
        if (type === 'plus') {
            item.amount += Math.abs(delta);
        } else {
            item.amount -= Math.abs(delta);
        }

        item.lastUpdate = dateStr;
        
        // Add to history
        item.history.push({
            type,
            amount: Math.abs(delta),
            description: description || (type === 'plus' ? 'জমা প্রদান করা হয়েছে' : 'জমা ফেরত দেওয়া হয়েছে'),
            date: dateStr
        });

        await deposit.save();
        res.json(deposit.items);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete deposit item
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const deposit = await Deposit.findOne({ userId: req.user._id });
        if (!deposit) return res.status(404).json({ message: 'তথ্য পাওয়া যায়নি' });

        deposit.items = deposit.items.filter(item => item._id.toString() !== req.params.id);
        await deposit.save();
        res.json(deposit.items);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
